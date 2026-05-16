import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma, ListingStatus } from '../../generated/prisma/client.js';

import { PrismaService } from '../../database/prisma.service.js';

import { CreateListingDto } from './dto/create-listing.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
import { LISTING_STATUS_TRANSITIONS } from './listings.constants.js';

const LISTING_INCLUDE = {
  category: true,
  images: {
    orderBy: { sortOrder: 'asc' },
    include: { upload: true },
  },
  seller: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.ListingInclude;

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.listing.findMany({
      where: {
        // Anyone can view listings that are available
        status: ListingStatus.AVAILABLE,
      },
      orderBy: { createdAt: 'desc' },
      include: LISTING_INCLUDE,
    });
  }

  async findOne(listingId: string) {
    const listing = await this.getListingOrThrow(listingId);

    if (
      // Anyone can view listings that are available
      listing.status !== ListingStatus.AVAILABLE
    ) {
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  async create(sellerId: string, dto: CreateListingDto) {
    await this.assertCategoryExists(dto.categoryId);
    await this.validateUploadIds(dto.uploadIds ?? [], sellerId);

    return this.prisma.listing.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        condition: dto.condition,
        status: dto.status ?? ListingStatus.AVAILABLE,
        meetupLocation: dto.meetupLocation ?? null,

        seller: { connect: { id: sellerId } },
        category: { connect: { id: dto.categoryId } },

        images: this.mapImages(dto.uploadIds),
      },
      include: LISTING_INCLUDE,
    });
  }

  async update(listingId: string, userId: string, dto: UpdateListingDto) {
    const listing = await this.getListingOrThrow(listingId);
    this.assertOwner(listing, userId);

    if (dto.categoryId) {
      await this.assertCategoryExists(dto.categoryId);
    }

    if (dto.uploadIds !== undefined) {
      await this.validateUploadIds(dto.uploadIds, userId);

      await this.prisma.listingImage.deleteMany({
        where: { listingId },
      });
    }

    return this.prisma.listing.update({
      where: { id: listingId },
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        condition: dto.condition,
        status: dto.status,

        meetupLocation: dto.meetupLocation ?? undefined,

        category: dto.categoryId
          ? { connect: { id: dto.categoryId } }
          : undefined,

        images: this.mapImages(dto.uploadIds),
      },
      include: LISTING_INCLUDE,
    });
  }

  async updateStatus(
    listingId: string,
    userId: string,
    newStatus: ListingStatus,
  ) {
    const listing = await this.getListingOrThrow(listingId);
    this.assertOwner(listing, userId);

    const allowed = LISTING_STATUS_TRANSITIONS[listing.status];

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid transition ${listing.status} → ${newStatus}`,
      );
    }

    return this.prisma.listing.update({
      where: { id: listingId },
      data: {
        status: newStatus,
        soldAt:
          newStatus === ListingStatus.SOLD &&
          listing.status !== ListingStatus.SOLD
            ? new Date()
            : undefined,
      },
      include: LISTING_INCLUDE,
    });
  }

  async delete(listingId: string, userId: string) {
    const listing = await this.getListingOrThrow(listingId);
    this.assertOwner(listing, userId);

    if (
      listing.status === ListingStatus.SOLD ||
      listing.status === ListingStatus.RESERVED
    ) {
      throw new BadRequestException('Listing cannot be deleted');
    }

    return this.prisma.listing.delete({
      where: { id: listingId },
    });
  }

  private async getListingOrThrow(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: LISTING_INCLUDE,
    });

    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  private assertOwner(listing: { sellerId: string }, userId: string) {
    if (listing.sellerId !== userId) {
      throw new ForbiddenException('Not allowed');
    }
  }

  private async assertCategoryExists(categoryId: string) {
    const exists = await this.prisma.listingCategory.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!exists) throw new NotFoundException('Category not found');
  }

  private async validateUploadIds(uploadIds: string[], userId: string) {
    if (!uploadIds?.length) return;

    const unique = [...new Set(uploadIds)];

    const uploads = await this.prisma.upload.findMany({
      where: { id: { in: unique } },
    });

    if (uploads.length !== unique.length) {
      throw new NotFoundException('Uploads not found');
    }

    if (uploads.some((u) => u.uploaderId !== userId)) {
      throw new ForbiddenException('Invalid upload ownership');
    }
  }

  private mapImages(uploadIds?: string[]) {
    if (!uploadIds?.length) return undefined;

    return {
      create: uploadIds.map((id, i) => ({
        upload: { connect: { id } },
        sortOrder: i,
      })),
    };
  }
}
