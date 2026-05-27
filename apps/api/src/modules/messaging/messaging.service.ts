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
import type { Notification as NotificationRecord } from '../../generated/prisma/client.js';

const conversationUserSelect = {
  id: true,
  name: true,
  image: true,
} as const;

const conversationSelect = {
  listing: {
    include: {
      images: {
        include: { upload: true },
        orderBy: { sortOrder: 'asc' },
      },
      category: true,
    },
  },
  buyer: {
    select: conversationUserSelect,
  },
  seller: {
    select: conversationUserSelect,
  },
  messages: {
    orderBy: { createdAt: 'desc' },
    take: 1,
    include: {
      sender: {
        select: conversationUserSelect,
      },
    },
  },
} as const;

const conversationReadInclude = (userId: string) => ({
  ...conversationSelect,
  _count: {
    select: {
      messages: {
        where: {
          senderId: { not: userId },
          isRead: false,
        },
      },
    },
  },
});

@Injectable()
export class MessagingService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async getOrCreateConversation(userId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, sellerId: true, status: true, title: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId === userId) {
      throw new ForbiddenException('Cannot message your own listing');
    }

    // Check for existing conversation
    const existing = await this.prisma.conversation.findUnique({
      where: {
        listingId_buyerId: {
          listingId,
          buyerId: userId,
        },
      },
      include: conversationReadInclude(userId),
    });

    if (existing) {
      return existing;
    }

    const validStatuses: ListingStatus[] = [
      ListingStatus.AVAILABLE,
      ListingStatus.RESERVED,
    ];

    if (!validStatuses.includes(listing.status)) {
      throw new ForbiddenException('Listing is not available for messaging');
    }

    // Create new conversation
    return this.prisma.conversation.create({
      data: {
        listingId,
        buyerId: userId,
        sellerId: listing.sellerId,
      },
      include: conversationReadInclude(userId),
    });
  }

  async getOrCreateConversationWithBuyer(
    userId: string,
    listingId: string,
    buyerId: string,
  ) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, sellerId: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('Not authorized to open this conversation');
    }

    if (buyerId === userId) {
      throw new ForbiddenException('Cannot message yourself');
    }

    const existing = await this.prisma.conversation.findUnique({
      where: {
        listingId_buyerId: {
          listingId,
          buyerId,
        },
      },
      include: conversationReadInclude(userId),
    });

    if (existing) {
      return existing;
    }

    return this.prisma.conversation.create({
      data: {
        listingId,
        buyerId,
        sellerId: userId,
      },
      include: conversationReadInclude(userId),
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
        sender: {
          select: conversationUserSelect,
        },
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
      `/messages/${conversation.id}`,
    );

    this.notificationsService.emitCreated(notification as NotificationRecord);

    return message;
  }

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        listing: {
          include: {
            images: {
              include: { upload: true },
              orderBy: { sortOrder: 'asc' },
              take: 1,
            },
          },
        },
        buyer: {
          select: conversationUserSelect,
        },
        seller: {
          select: conversationUserSelect,
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            isRead: true,
            senderId: true,
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: userId },
                isRead: false,
              },
            },
          },
        },
      },
      orderBy: {
        lastMessageAt: {
          sort: 'desc',
          nulls: 'last',
        },
      },
    });
  }

  async getConversation(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        ...conversationSelect,
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: conversationUserSelect,
            },
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
