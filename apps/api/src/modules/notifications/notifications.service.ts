import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { NotificationFilters, NotificationType } from '@repo/api';
import { NotificationsGateway } from './notifications.gateway.js';
import type { Notification as NotificationRecord } from '../../generated/prisma/client.js';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, unknown>,
  ) {
    void metadata;

    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
      },
    });
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
  }

  emitRead(notification: NotificationRecord) {
    this.notificationsGateway.emitNotificationRead(notification);
  }

  emitReadMany(notifications: NotificationRecord[]) {
    this.notificationsGateway.emitNotificationsRead(notifications);
  }
}
