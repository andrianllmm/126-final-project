import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';

import {
  CreateListingInput,
  UpdateListingInput,
  ListingStatus,
  Listing,
  ListingList,
  Transaction,
  TransactionStatus,
} from '@repo/api';

import { ListingPolicy } from './listing.policy.js';

const LISTING_INCLUDE = {
  category: true,

  images: {
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      sortOrder: true,
      upload: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  },

  seller: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.ListingInclude;

const mapListing = (listing: any) => ({
  ...listing,
  price: Number(listing.price),
});

const mapTransaction = (t: any) => ({
  ...t,
  agreedPrice: Number(t.agreedPrice),

  listing: {
    ...t.listing,
    price: Number(t.listing.price),
  },
});

@Injectable()
export class ListingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: ListingPolicy,
  ) {}

  async findAll(): Promise<ListingList> {
    const listings = await this.prisma.listing.findMany({
      where: {
        status: ListingStatus.AVAILABLE,
      },
      orderBy: { createdAt: 'desc' },
      include: LISTING_INCLUDE,
    });

    return listings.map(mapListing);
  }

  async findOne(listingId: string): Promise<Listing> {
    const listing = await this.getListingOrThrow(listingId);

    if (listing.status !== ListingStatus.AVAILABLE) {
      throw new NotFoundException('Listing not found');
    }

    return mapListing(listing);
  }

  async create(sellerId: string, input: CreateListingInput): Promise<Listing> {
    await this.policy.assertValidCategory(input.categoryId);

    const listing = await this.prisma.listing.create({
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        condition: input.condition,
        status: input.status ?? ListingStatus.AVAILABLE,

        seller: { connect: { id: sellerId } },
        category: { connect: { id: input.categoryId } },
      },
      include: LISTING_INCLUDE,
    });

    return mapListing(listing);
  }

  async update(
    listingId: string,
    userId: string,
    input: UpdateListingInput,
  ): Promise<Listing> {
    const listing = await this.getListingOrThrow(listingId);

    this.policy.assertOwner(listing, userId);

    if (input.categoryId) {
      await this.policy.assertValidCategory(input.categoryId);
    }

    const updated = await this.prisma.listing.update({
      where: { id: listingId },
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        condition: input.condition,

        category: input.categoryId
          ? { connect: { id: input.categoryId } }
          : undefined,
      },
      include: LISTING_INCLUDE,
    });

    return mapListing(updated);
  }

  async updateStatus(
    listingId: string,
    userId: string,
    newStatus: ListingStatus,
  ): Promise<Listing> {
    const listing = await this.getListingOrThrow(listingId);

    this.policy.assertOwner(listing, userId);
    this.policy.assertValidStatusTransition(listing.status, newStatus);

    const updated = await this.prisma.listing.update({
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

    return mapListing(updated);
  }

  async delete(listingId: string, userId: string): Promise<Listing> {
    const listing = await this.getListingOrThrow(listingId);

    this.policy.assertOwner(listing, userId);
    this.policy.assertCanDelete(listing);

    const deleted = await this.prisma.listing.delete({
      where: { id: listingId },
      include: LISTING_INCLUDE,
    });

    return mapListing(deleted);
  }

  private async getListingOrThrow(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: LISTING_INCLUDE,
    });

    if (!listing) throw new NotFoundException('Listing not found');

    return listing;
  }

  async getListingTransactions(
    listingId: string,
    status?: TransactionStatus | TransactionStatus[],
  ): Promise<Transaction[]> {
    await this.getListingOrThrow(listingId);

    const statuses = status
      ? Array.isArray(status)
        ? status
        : [status]
      : undefined;

    const transactions = await this.prisma.transaction.findMany({
      where: {
        listingId,
        ...(statuses?.length ? { status: { in: statuses } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: true,
        seller: true,
        listing: {
          include: {
            images: {
              include: {
                upload: true,
              },
            },
          },
        },
      },
    });

    return transactions.map(mapTransaction);
  }
}
