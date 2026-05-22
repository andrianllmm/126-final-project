import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { UploadsService } from '../uploads/uploads.service.js';
import { UploadFile } from '../uploads/uploads.types.js';
import {
  UserProfile,
  UserProfileUpdateInput,
  UserProfileStats,
} from '@repo/api';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private uploadsService: UploadsService,
  ) {}

  async findProfileById(id: string): Promise<UserProfile | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfileById(
    id: string,
    input: UserProfileUpdateInput,
  ): Promise<UserProfile> {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: input.name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async setAvatar(id: string, avatarFile: UploadFile): Promise<UserProfile> {
    const currentUser = await this.prisma.user.findUnique({
      where: { id },
      select: { image: true },
    });

    const uploaded = await this.uploadsService.upload(avatarFile, id);

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        image: uploaded.url,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // cleanup old avatar
    if (currentUser?.image) {
      try {
        await this.uploadsService.deleteByUrl(currentUser.image, id);
      } catch (error) {
        if (!(error instanceof NotFoundException)) throw error;
      }
    }

    return user;
  }

  async removeAvatar(id: string): Promise<UserProfile> {
    const currentUser = await this.prisma.user.findUnique({
      where: { id },
      select: { image: true },
    });

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        image: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (currentUser?.image) {
      await this.uploadsService.deleteByUrl(currentUser.image, id);
    }

    return user;
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
        ? 1
        : respondedConversations / totalConversations;

    return {
      averageRating,
      reviewCount,
      salesCount,
      listingCount,
      responseRate,
    };
  }
}
