import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { NotificationFilters, NotificationType } from '@repo/api';
import { NotificationsGateway } from './notifications.gateway.js';
import type { Notification as NotificationRecord } from '../../generated/prisma/client.js';
import { PrismaTx } from '../../common/prisma-tx.js';
import webpush from 'web-push';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  private ensureVapidSet() {
    try {
      webpush.setVapidDetails(
        process.env.VAPID_CONTACT || 'mailto:admin@example.com',
        process.env.VAPID_PUBLIC_KEY || '',
        process.env.VAPID_PRIVATE_KEY || '',
      );
    } catch (e) {
      // ignore; will fail when sending if not configured
      console.error('Failed to set VAPID details', e);
    }
  }

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, unknown>,
    actionLink?: string,
  ) {
    void metadata;

    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        actionLink,
      },
    });
  }

  async createWithTx(
    tx: PrismaTx,
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, unknown>,
    actionLink?: string,
  ) {
    void metadata;

    return tx.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        actionLink,
      },
    });
  }

  async createAndNotify(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, unknown>,
    actionLink?: string,
  ) {
    const notification = await this.create(
      userId,
      type,
      title,
      message,
      metadata,
      actionLink,
    );

    // emit over sockets
    this.emitCreated(notification as NotificationRecord);

    // send web-push in background
    void this.sendPushToUser(userId, {
      title,
      body: message,
      actionLink,
    });

    return notification;
  }

  async savePushSubscription(
    userId: string,
    subscription: {
      endpoint: string;
      keys?: { p256dh?: string; auth?: string };
    },
  ) {
    return this.prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        userId,
        p256dh: subscription.keys?.p256dh ?? '',
        auth: subscription.keys?.auth ?? '',
      },
      create: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys?.p256dh ?? '',
        auth: subscription.keys?.auth ?? '',
      },
    });
  }

  async removePushSubscription(userId: string, endpoint: string) {
    return this.prisma.pushSubscription.deleteMany({
      where: { userId, endpoint },
    });
  }

  async sendPushToUser(
    userId: string,
    payload: Record<string, unknown> | string,
  ) {
    this.ensureVapidSet();
    const subs = await this.prisma.pushSubscription.findMany({
      where: { userId },
    });

    const body =
      typeof payload === 'string' ? payload : JSON.stringify(payload);

    for (const s of subs) {
      const pushSub = {
        endpoint: s.endpoint,
        keys: {
          p256dh: s.p256dh,
          auth: s.auth,
        },
      };

      try {
        await webpush.sendNotification(pushSub, body);
      } catch (err: any) {
        // if subscription is gone, remove it from DB
        const status = err?.statusCode ?? err?.status;
        if (status === 404 || status === 410) {
          await this.prisma.pushSubscription.deleteMany({
            where: { endpoint: s.endpoint },
          });
        }
      }
    }
  }

  async findAll(userId: string, filters: NotificationFilters = {}) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        ...(filters.read === undefined ? {} : { isRead: filters.read }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    const unreadNotifications = await this.prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (unreadNotifications.length === 0) {
      return unreadNotifications;
    }

    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return unreadNotifications.map((notification) => ({
      ...notification,
      isRead: true,
    }));
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  emitCreated(notification: NotificationRecord) {
    this.notificationsGateway.emitNotificationCreated(notification);

    // also send web-push to user's subscriptions (fire-and-forget)
    void this.sendPushToUser(notification.userId, {
      title: notification.title,
      body: notification.message,
      actionLink: notification.actionLink,
    });
  }

  emitRead(notification: NotificationRecord) {
    this.notificationsGateway.emitNotificationRead(notification);
  }

  emitReadMany(notifications: NotificationRecord[]) {
    this.notificationsGateway.emitNotificationsRead(notifications);
  }
}
