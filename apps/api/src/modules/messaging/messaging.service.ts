import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { ListingStatus, NotificationType } from '@repo/api';
import { NotificationsGateway } from '../notifications/notifications.gateway.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { truncateText } from '../../common/truncate-text.js';

@Injectable()
export class MessagingService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async createConversation(userId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, sellerId: true, status: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId === userId) {
      throw new ForbiddenException('Cannot message your own listing');
    }

    const validStatuses: ListingStatus[] = [
      ListingStatus.AVAILABLE,
      ListingStatus.RESERVED,
    ];

    if (!validStatuses.includes(listing.status)) {
      throw new ForbiddenException('Listing is not available for messaging');
    }

    const existing = await this.prisma.conversation.findUnique({
      where: {
        listingId_buyerId: {
          listingId,
          buyerId: userId,
        },
      },
      include: {
        listing: true,
        buyer: { include: { avatarUpload: true } },
        seller: { include: { avatarUpload: true } },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.conversation.create({
      data: {
        listingId,
        buyerId: userId,
        sellerId: listing.sellerId,
      },
      include: {
        listing: true,
        buyer: { include: { avatarUpload: true } },
        seller: { include: { avatarUpload: true } },
      },
    });
  }

  async sendMessage(userId: string, conversationId: string, content: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        buyerId: true,
        sellerId: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      throw new ForbiddenException('Not authorized for this conversation');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content,
      },
      include: {
        sender: { include: { avatarUpload: true } },
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    const recipientId =
      conversation.buyerId === userId
        ? conversation.sellerId
        : conversation.buyerId;

    const notification = await this.notificationsService.create(
      recipientId,
      NotificationType.MESSAGE,
      'New message',
      truncateText(content, 60),
      {
        conversationId,
      },
    );

    this.notificationsGateway.emitNotificationCreated(notification);

    return message;
  }

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        listing: true,
        buyer: { include: { avatarUpload: true } },
        seller: { include: { avatarUpload: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            isRead: true,
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async getConversation(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        listing: true,
        buyer: { include: { avatarUpload: true } },
        seller: { include: { avatarUpload: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: { include: { avatarUpload: true } },
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return conversation;
  }

  async markMessagesAsRead(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        buyerId: true,
        sellerId: true,
      },
    });

    if (
      !conversation ||
      (conversation.buyerId !== userId && conversation.sellerId !== userId)
    ) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      select: { id: true },
    });

    return this.prisma.message.count({
      where: {
        conversationId: {
          in: conversations.map((c) => c.id),
        },
        senderId: { not: userId },
        isRead: false,
      },
    });
  }
}
