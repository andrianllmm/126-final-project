import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { NotificationDto, NotificationListDto } from './notifications.dto.js';
import { NotificationsGateway } from './notifications.gateway.js';
import { NotificationsService } from './notifications.service.js';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  @Get()
  @ZodResponse({ type: NotificationListDto })
  getNotifications(
    @Session() session: UserSession,
    @Query('read') read?: string,
  ) {
    return this.notificationsService.findAll(session.user.id, {
      read: parseReadFilter(read),
    });
  }

  @Get('unread')
  @ZodResponse({ type: NotificationListDto })
  getUnreadNotifications(@Session() session: UserSession) {
    return this.notificationsService.findAll(session.user.id, {
      read: false,
    });
  }

  @Get('count')
  getUnreadCount(@Session() session: UserSession) {
    return this.notificationsService.getUnreadCount(session.user.id);
  }

  @Patch(':id/read')
  @ZodResponse({ type: NotificationDto })
  async markAsRead(
    @Session() session: UserSession,
    @Param('id') notificationId: string,
  ) {
    const notification = await this.notificationsService.markAsRead(
      notificationId,
      session.user.id,
    );

    this.notificationsGateway.emitNotificationRead(notification);

    return notification;
  }

  @Patch('read-all')
  @ZodResponse({ type: NotificationListDto })
  async markAllAsRead(@Session() session: UserSession) {
    const notifications = await this.notificationsService.markAllAsRead(
      session.user.id,
    );

    this.notificationsGateway.emitNotificationsRead(notifications);

    return notifications;
  }
}

function parseReadFilter(read?: string) {
  if (read === 'true') return true;
  if (read === 'false') return false;
  return undefined;
}
