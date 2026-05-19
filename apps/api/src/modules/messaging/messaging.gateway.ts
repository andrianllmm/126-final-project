import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth/auth.config.js';
import { MessagingService } from './messaging.service.js';
import { messageSchema } from '@repo/api';
import { env } from '../../config/env.js';

type AuthenticatedSocket = Socket & {
  data: {
    user?: { id?: string };
    session?: { user?: { id?: string } };
  };
};

@WebSocketGateway({
  namespace: 'messaging',
  cors: {
    origin: env.webUrl,
    credentials: true,
  },
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(MessagingGateway.name);
  private onlineUsers = new Map<string, Set<string>>();

  constructor(
    private readonly messagingService: MessagingService,
    private readonly authService: AuthService<typeof auth>,
  ) {}

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

    this.logger.log(`User ${userId} connected (socket: ${client.id})`);

    await client.join(`user:${userId}`);
    this.emitUserStatus(userId, 'online');
  }

  handleDisconnect(client: Socket) {
    const userId = this.getUserId(client);
    if (!userId) return;

    const sockets = this.onlineUsers.get(userId);

    if (sockets) {
      sockets.delete(client.id);

      if (sockets.size === 0) {
        this.onlineUsers.delete(userId);
        this.emitUserStatus(userId, 'offline');
      }
    }

    this.logger.log(`User ${userId} disconnected (socket: ${client.id})`);
  }

  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    this.requireUserId(client);
    await client.join(`conversation:${conversationId}`);

    return { event: 'joinedConversation', data: conversationId };
  }

  @SubscribeMessage('leaveConversation')
  async handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    this.requireUserId(client);
    await client.leave(`conversation:${conversationId}`);

    return { event: 'leftConversation', data: conversationId };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    {
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    },
  ) {
    const userId = this.requireUserId(client);

    try {
      const message = await this.messagingService.sendMessage(
        userId,
        conversationId,
        content,
      );

      const typedMessage = messageSchema.parse({
        ...message,
        createdAt: message.createdAt.toISOString(),
      });

      client.emit('messageSent', typedMessage);
      this.server
        .to(`conversation:${conversationId}`)
        .emit('newMessage', typedMessage);

      return typedMessage;
    } catch (error) {
      return {
        event: 'error',
        data: error instanceof Error ? error.message : String(error),
      };
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { conversationId: string; isTyping: boolean },
  ) {
    const userId = this.requireUserId(client);

    client.to(`conversation:${data.conversationId}`).emit('userTyping', {
      userId,
      conversationId: data.conversationId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    const userId = this.requireUserId(client);

    try {
      await this.messagingService.markMessagesAsRead(userId, conversationId);

      this.server.to(`conversation:${conversationId}`).emit('messagesRead', {
        conversationId,
        readBy: userId,
      });

      return { event: 'markedAsRead', data: conversationId };
    } catch (error) {
      return {
        event: 'error',
        data: error instanceof Error ? error.message : String(error),
      };
    }
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
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

  private emitUserStatus(userId: string, status: 'online' | 'offline') {
    this.server.emit('userStatus', { userId, status });
  }
}
