import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { EmbeddingsService } from '../embeddings/embeddings.service.js';
import pgvector from 'pgvector';

import {
  CreateListingInput,
  ListingPage,
  ListingPaginationQuery,
  UpdateListingInput,
  ListingStatus,
  Listing,
  Transaction,
  TransactionStatus,
  ListingCategoryList,
} from '@repo/api';

import { ListingPolicy } from './listing.policy.js';
import {
  decorateListing,
  decorateListings,
  LISTING_INCLUDE,
} from './listing-metadata.js';

const mapTransaction = (t: any) => ({
  ...t,
  agreedPrice: Number(t.agreedPrice),

  listing: {
    ...t.listing,
    price: Number(t.listing.price),
  },
});

const mapCategory = (category: any) => category;

const allowedReadListingStatuses: ListingStatus[] = [
  ListingStatus.AVAILABLE,
  ListingStatus.RESERVED,
  ListingStatus.SOLD,
];

@Injectable()
export class ListingsService {
  private readonly logger = new Logger(ListingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: ListingPolicy,
    private readonly embeddings: EmbeddingsService,
  ) {}

  async findAll(
    query: ListingPaginationQuery,
    userId?: string,
  ): Promise<ListingPage> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where = {
      status: {
        in: allowedReadListingStatuses,
      },
    };

    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: LISTING_INCLUDE,
      }),
      this.prisma.listing.count({ where }),
    ]);

    return {
      data: await decorateListings(this.prisma, listings, userId),
      meta: {
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        page,
        limit,
      },
    };
  }

  async findOne(listingId: string, userId?: string): Promise<Listing> {
    const listing = await this.getListingOrThrow(listingId);

    if (!allowedReadListingStatuses.includes(listing.status)) {
      throw new NotFoundException('Listing not found');
    }

    return decorateListing(this.prisma, listing, userId);
  }

  async create(sellerId: string, input: CreateListingInput): Promise<Listing> {
    const categoryId = await this.policy.getCategoryIdOrThrow(input.categoryId);

    const listing = await this.prisma.listing.create({
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        condition: input.condition,
        status: input.status ?? ListingStatus.AVAILABLE,

        seller: { connect: { id: sellerId } },
        category: { connect: { id: categoryId } },
      },
      include: LISTING_INCLUDE,
    });

    this.updateEmbedding(listing.id, listing.title, listing.description);

    return decorateListing(this.prisma, listing);
  }

  async update(
    listingId: string,
    userId: string,
    input: UpdateListingInput,
  ): Promise<Listing> {
    const listing = await this.getListingOrThrow(listingId);

    this.policy.assertOwner(listing, userId);

    let categoryId: string | undefined;
    if (input.categoryId) {
      categoryId = await this.policy.getCategoryIdOrThrow(input.categoryId);
    }

    const updated = await this.prisma.listing.update({
      where: { id: listingId },
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        condition: input.condition,

        category: categoryId ? { connect: { id: categoryId } } : undefined,
      },
      include: LISTING_INCLUDE,
    });

    if (input.title !== undefined || input.description !== undefined) {
      this.updateEmbedding(updated.id, updated.title, updated.description);
    }

    return decorateListing(this.prisma, updated);
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

    return decorateListing(this.prisma, updated);
  }

  async delete(listingId: string, userId: string): Promise<Listing> {
    const listing = await this.getListingOrThrow(listingId);

    this.policy.assertOwner(listing, userId);
    this.policy.assertCanDelete(listing);

    const deleted = await this.prisma.listing.delete({
      where: { id: listingId },
      include: LISTING_INCLUDE,
    });

    return decorateListing(this.prisma, deleted);
  }

  private updateEmbedding(
    listingId: string,
    title: string,
    description: string,
  ): void {
    this.embeddings
      .embedText(`${title}\n${description}`)
      .then((vector) => {
        const embedding = pgvector.toSql(vector);
        return this.prisma.$executeRaw`
          UPDATE "Listing" SET "embedding" = ${embedding}::vector
          WHERE "id" = ${listingId}
        `;
      })
      .catch((err) =>
        this.logger.error(
          `Failed to compute embedding for listing ${listingId}`,
          err,
        ),
      );
  }

  private async getListingOrThrow(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: LISTING_INCLUDE,
    });

    if (!listing) throw new NotFoundException('Listing not found');

    return listing;
  }

  async likeListing(listingId: string, userId: string): Promise<Listing> {
    const listing = await this.getListingOrThrow(listingId);

    await this.prisma.likedListing.upsert({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
      create: {
        userId,
        listingId,
      },
      update: {},
    });

    return decorateListing(this.prisma, listing, userId);
  }

  async unlikeListing(listingId: string, userId: string): Promise<Listing> {
    const listing = await this.getListingOrThrow(listingId);

    await this.prisma.likedListing.deleteMany({
      where: {
        userId,
        listingId,
      },
    });

    return decorateListing(this.prisma, listing, userId);
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
        meetupLocation: true,
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

  async listCategories(): Promise<ListingCategoryList> {
    const categories = await this.prisma.listingCategory.findMany({
      orderBy: { categoryName: 'asc' },
      select: {
        id: true,
        categoryName: true,
        slug: true,
      },
    });

    return categories.map(mapCategory);
  }
}
