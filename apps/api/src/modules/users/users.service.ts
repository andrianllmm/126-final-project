import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { UploadsService } from '../uploads/uploads.service.js';
import { UploadFile } from '../uploads/uploads.types.js';
import { UserProfile, UserProfileStats } from '@repo/api';

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
        avatarUpload: {
          select: {
            id: true,
            url: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfileById(
    id: string,
    input: { name?: string },
    avatarFile?: UploadFile,
    removeAvatar = false,
  ): Promise<UserProfile> {
    const currentUser = await this.prisma.user.findUnique({
      where: { id },
      select: {
        avatarUploadId: true,
      },
    });

    let nextAvatarUploadId = currentUser?.avatarUploadId ?? null;

    if (avatarFile) {
      const uploaded = await this.uploadsService.upload(avatarFile, id);
      nextAvatarUploadId = uploaded.id;
    }

    const shouldRemoveAvatar = removeAvatar && !avatarFile;

    const avatarUploadId = shouldRemoveAvatar
      ? null
      : avatarFile
        ? nextAvatarUploadId
        : (currentUser?.avatarUploadId ?? null);

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: input.name,
        avatarUploadId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUpload: {
          select: {
            id: true,
            url: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if ((avatarFile || shouldRemoveAvatar) && currentUser?.avatarUploadId) {
      await this.uploadsService.delete(currentUser.avatarUploadId, id);
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
