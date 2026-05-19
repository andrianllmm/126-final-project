import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { Server, Socket } from 'socket.io';

import { auth } from '../auth/auth.config.js';
import { env } from '../../config/env.js';
import type { Notification as NotificationRecord } from '../../generated/prisma/client.js';

type AuthenticatedSocket = Socket & {
  data: {
    user?: { id?: string };
    session?: { user?: { id?: string } };
  };
};

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: env.webUrl,
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private onlineUsers = new Map<string, Set<string>>();

  constructor(private readonly authService: AuthService<typeof auth>) {}

  async handleConnection(client: Socket) {
    const session = await this.authService.api.getSession({
      headers: fromNodeHeaders(client.handshake.headers),
    });

    const userId = session?.user?.id;

    if (!userId) {
      client.disconnect();
      return;
    }

    const typedClient = client as AuthenticatedSocket;
    typedClient.data.session = session;
    typedClient.data.user = session.user;

    if (!this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, new Set());
    }

    this.onlineUsers.get(userId)?.add(client.id);

    this.logger.log(
      `User ${userId} connected to notifications (socket: ${client.id})`,
    );

    await client.join(`user:${userId}`);
  }

  handleDisconnect(client: Socket) {
    const userId = this.getUserId(client);
    if (!userId) return;

    const sockets = this.onlineUsers.get(userId);

    if (sockets) {
      sockets.delete(client.id);

      if (sockets.size === 0) {
        this.onlineUsers.delete(userId);
      }
    }

    this.logger.log(
      `User ${userId} disconnected from notifications (socket: ${client.id})`,
    );
  }

  @SubscribeMessage('ping')
  handlePing(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: unknown,
  ) {
    this.requireUserId(client);

    return {
      event: 'pong',
      data: payload,
    };
  }

  emitNotificationCreated(notification: NotificationRecord) {
    this.server.to(`user:${notification.userId}`).emit('notification:new', {
      ...notification,
      createdAt: notification.createdAt.toISOString(),
    });
  }

  emitNotificationRead(notification: NotificationRecord) {
    this.server.to(`user:${notification.userId}`).emit('notification:read', {
      ...notification,
      createdAt: notification.createdAt.toISOString(),
    });
  }

  emitNotificationsRead(notifications: NotificationRecord[]) {
    for (const notification of notifications) {
      this.emitNotificationRead(notification);
    }
  }

  private getUserId(client: Socket): string | undefined {
    const typedClient = client as AuthenticatedSocket;

    return typedClient.data.session?.user?.id ?? typedClient.data.user?.id;
  }

  private requireUserId(client: Socket): string {
    const userId = this.getUserId(client);

    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return userId;
  }
}
