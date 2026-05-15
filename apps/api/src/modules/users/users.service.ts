import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { UserProfile, UserProfileStats } from '@repo/api';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findProfileById(id: string): Promise<UserProfile | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async getProfileStats(userId: string): Promise<UserProfileStats> {
    const [
      reviewAggregate,
      salesCount,
      listingCount,
      totalConversations,
      respondedConversations,
    ] = await Promise.all([
      this.prisma.review.aggregate({
        where: {
          revieweeId: userId,
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      }),

      // Total completed sales by this user as seller
      this.prisma.transaction.count({
        where: {
          sellerId: userId,
          status: 'COMPLETED',
        },
      }),

      // Active listings currently available for sale
      this.prisma.listing.count({
        where: {
          sellerId: userId,
          status: 'AVAILABLE',
        },
      }),

      // Total conversations where user is the seller
      this.prisma.conversation.count({
        where: {
          sellerId: userId,
        },
      }),

      // Conversations where seller has sent at least one message
      this.prisma.conversation.count({
        where: {
          sellerId: userId,
          messages: {
            some: {
              senderId: userId,
            },
          },
        },
      }),
    ]);

    // Average rating from all received reviews
    const averageRating = Number(reviewAggregate._avg.rating?.toFixed(1) ?? 0);

    // Total number of reviews received
    const reviewCount = reviewAggregate._count.rating;

    // % of conversations where seller has responded at least once
    const responseRate =
      totalConversations === 0
        ? 100
        : Math.round((respondedConversations / totalConversations) * 100);

    return {
      averageRating,
      reviewCount,
      salesCount,
      listingCount,
      responseRate,
    };
  }
}
