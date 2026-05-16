import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '../../generated/prisma/client.js';

import { PrismaService } from '../../database/prisma.service.js';

import {
  CreateListingInput,
  UpdateListingInput,
  ListingStatus,
} from '@repo/api';
import { ListingPolicy } from './listing.policy.js';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: ListingPolicy,
  ) {}

  async findAll() {
    return this.prisma.listing.findMany({
      where: {
        status: ListingStatus.AVAILABLE,
      },
      orderBy: { createdAt: 'desc' },
      include: LISTING_INCLUDE,
    });
  }

  async findOne(listingId: string) {
    const listing = await this.getListingOrThrow(listingId);

    if (listing.status !== ListingStatus.AVAILABLE) {
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  async create(sellerId: string, input: CreateListingInput) {
    await this.policy.assertValidCategory(input.categoryId);
    await this.policy.assertValidUploadIds(input.uploadIds ?? [], sellerId);

    return this.prisma.listing.create({
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        condition: input.condition,
        status: input.status ?? ListingStatus.AVAILABLE,
        meetupLocation: input.meetupLocation ?? null,

        seller: { connect: { id: sellerId } },
        category: { connect: { id: input.categoryId } },

        images: input.uploadIds?.length
          ? {
              create: input.uploadIds.map((id, i) => ({
                upload: { connect: { id } },
                sortOrder: i,
              })),
            }
          : undefined,
      },
      include: LISTING_INCLUDE,
    });
  }

  async update(listingId: string, userId: string, input: UpdateListingInput) {
    const listing = await this.getListingOrThrow(listingId);

    this.policy.assertOwner(listing, userId);

    if (input.categoryId) {
      await this.policy.assertValidCategory(input.categoryId);
    }

    if (input.uploadIds !== undefined) {
      await this.policy.assertValidUploadIds(input.uploadIds, userId);

      await this.prisma.listingImage.deleteMany({
        where: { listingId },
      });
    }

    return this.prisma.listing.update({
      where: { id: listingId },
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        condition: input.condition,

        meetupLocation: input.meetupLocation ?? undefined,

        category: input.categoryId
          ? { connect: { id: input.categoryId } }
          : undefined,

        images: input.uploadIds?.length
          ? {
              create: input.uploadIds.map((id, i) => ({
                upload: { connect: { id } },
                sortOrder: i,
              })),
            }
          : undefined,
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

    this.policy.assertOwner(listing, userId);
    this.policy.assertValidStatusTransition(listing.status, newStatus);

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

    this.policy.assertOwner(listing, userId);
    this.policy.assertCanDelete(listing);

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
}
