import { Injectable } from '@nestjs/common';
import pgvector from 'pgvector';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';
import { EmbeddingsService } from '../embeddings/embeddings.service.js';

import {
  ListingStatus,
  type ListingPage,
  type ListingSearchQuery,
} from '@repo/api';

import { decorateListings, LISTING_INCLUDE } from './listing-metadata.js';

function buildOrderBy(
  sortBy: NonNullable<ListingSearchQuery['sortBy']>,
  sortOrder: NonNullable<ListingSearchQuery['sortOrder']>,
): Prisma.ListingOrderByWithRelationInput {
  switch (sortBy) {
    case 'price':
      return { price: sortOrder };
    case 'title':
      return { title: sortOrder };
    case 'condition':
      return { condition: sortOrder };
    case 'category':
      return { category: { categoryName: sortOrder } };
    default:
      return { createdAt: sortOrder };
  }
}

function buildWhere(
  query: ListingSearchQuery,
  options: { includeTextSearch?: boolean } = {},
): Prisma.ListingWhereInput {
  const { includeTextSearch = true } = options;

  const where: Prisma.ListingWhereInput[] = [
    {
      status: {
        notIn: [ListingStatus.DRAFT, ListingStatus.ARCHIVED],
        ...(query.status?.length ? { in: query.status } : {}),
      },
    },
  ];

  if (query.condition?.length) {
    where.push({ condition: { in: query.condition } });
  }

  if (query.category?.length) {
    where.push({
      OR: query.category.flatMap((value) => [
        {
          category: {
            categoryName: {
              contains: value,
              mode: 'insensitive',
            },
          },
        },
        {
          category: {
            slug: {
              contains: value,
              mode: 'insensitive',
            },
          },
        },
      ]),
    });
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.push({
      price: {
        ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
        ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
      },
    });
  }

  if (includeTextSearch && query.q) {
    where.push({
      OR: [
        {
          title: {
            contains: query.q,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query.q,
            mode: 'insensitive',
          },
        },
        {
          seller: {
            name: {
              contains: query.q,
              mode: 'insensitive',
            },
          },
        },
        {
          category: {
            OR: [
              {
                categoryName: {
                  contains: query.q,
                  mode: 'insensitive',
                },
              },
              {
                slug: {
                  contains: query.q,
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
      ],
    });
  }

  return where.length ? { AND: where } : {};
}

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddings: EmbeddingsService,
  ) {}

  async search(
    query: ListingSearchQuery,
    userId?: string,
  ): Promise<ListingPage> {
    if (query.q) {
      return this.searchSemantic(query, userId);
    }

    if (query.sortBy === 'forYou' && userId) {
      const personalized = await this.searchPersonalized(query, userId);
      if (personalized) return personalized;
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;
    const where = buildWhere(query);

    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        orderBy: buildOrderBy(
          query.sortBy ?? 'createdAt',
          query.sortOrder ?? 'desc',
        ),
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

  private async searchPersonalized(
    query: ListingSearchQuery,
    userId: string,
  ): Promise<ListingPage | null> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    const userRows = await this.prisma.$queryRaw<
      { embedding: string | null }[]
    >`
      SELECT embedding::text as embedding FROM "user" WHERE id = ${userId}
    `;
    const userEmbeddingText = userRows[0]?.embedding;
    if (!userEmbeddingText) return null; // cold start: no embedding yet

    const where = buildWhere(query, { includeTextSearch: false });
    const candidates = await this.prisma.listing.findMany({
      where,
      select: { id: true },
    });
    const candidateIds = candidates.map((listing) => listing.id);

    if (candidateIds.length === 0) {
      return { data: [], meta: { total: 0, totalPages: 1, page, limit } };
    }

    const skip = (page - 1) * limit;
    const poolSize = skip + limit;
    const similarityCount = Math.ceil(poolSize * 0.7);

    const similarityRows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "Listing"
      WHERE id = ANY(${candidateIds}) AND "embedding" IS NOT NULL
      ORDER BY "embedding" <=> ${userEmbeddingText}::vector
      LIMIT ${similarityCount}
    `;
    const similarityIds = similarityRows.map((row) => row.id);
    const similarityIdSet = new Set(similarityIds);

    // Backfill with recency picks if the similarity pool came up short
    // (e.g. few candidates have an embedding yet), so the page never
    // comes up short of poolSize when enough candidates exist overall.
    const recencyCount = poolSize - similarityIds.length;

    const recencyListings = await this.prisma.listing.findMany({
      where: {
        ...where,
        id: { notIn: [...similarityIdSet] },
      },
      orderBy: { createdAt: 'desc' },
      take: recencyCount,
      select: { id: true },
    });
    const recencyIds = recencyListings.map((listing) => listing.id);

    const interleaved: string[] = [];
    let si = 0;
    let ri = 0;
    while (
      interleaved.length < poolSize &&
      (si < similarityIds.length || ri < recencyIds.length)
    ) {
      for (let i = 0; i < 2 && si < similarityIds.length; i++) {
        interleaved.push(similarityIds[si++]!);
      }
      if (ri < recencyIds.length) {
        interleaved.push(recencyIds[ri++]!);
      }
    }

    const pageIds = interleaved.slice(skip, skip + limit);
    const total = await this.prisma.listing.count({ where });

    if (pageIds.length === 0) {
      return {
        data: [],
        meta: { total, totalPages: Math.max(1, Math.ceil(total / limit)), page, limit },
      };
    }

    const listings = await this.prisma.listing.findMany({
      where: { id: { in: pageIds } },
      include: LISTING_INCLUDE,
    });
    const listingsById = new Map(listings.map((listing) => [listing.id, listing]));
    const ordered = pageIds
      .map((id) => listingsById.get(id))
      .filter((listing) => listing !== undefined);

    return {
      data: await decorateListings(this.prisma, ordered, userId),
      meta: {
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        page,
        limit,
      },
    };
  }

  private async searchSemantic(
    query: ListingSearchQuery,
    userId?: string,
  ): Promise<ListingPage> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where = buildWhere(query, { includeTextSearch: false });
    const candidates = await this.prisma.listing.findMany({
      where,
      select: { id: true },
    });
    const candidateIds = candidates.map((listing) => listing.id);

    if (candidateIds.length === 0) {
      return {
        data: [],
        meta: { total: 0, totalPages: 1, page, limit },
      };
    }

    const queryEmbedding = pgvector.toSql(
      await this.embeddings.embedText(query.q as string),
    );

    const [rankedRows, countRows] = await Promise.all([
      this.prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM "Listing"
        WHERE id = ANY(${candidateIds}) AND "embedding" IS NOT NULL
        ORDER BY "embedding" <=> ${queryEmbedding}::vector
        LIMIT ${limit} OFFSET ${skip}
      `,
      this.prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) as count FROM "Listing"
        WHERE id = ANY(${candidateIds}) AND "embedding" IS NOT NULL
      `,
    ]);

    const rankedIds = rankedRows.map((row) => row.id);
    const total = Number(countRows[0]?.count ?? 0);

    if (rankedIds.length === 0) {
      return {
        data: [],
        meta: { total, totalPages: Math.max(1, Math.ceil(total / limit)), page, limit },
      };
    }

    const listings = await this.prisma.listing.findMany({
      where: { id: { in: rankedIds } },
      include: LISTING_INCLUDE,
    });
    const listingsById = new Map(listings.map((listing) => [listing.id, listing]));
    const ordered = rankedIds
      .map((id) => listingsById.get(id))
      .filter((listing) => listing !== undefined);

    return {
      data: await decorateListings(this.prisma, ordered, userId),
      meta: {
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        page,
        limit,
      },
    };
  }
}
