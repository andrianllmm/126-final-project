import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';

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

function buildWhere(query: ListingSearchQuery): Prisma.ListingWhereInput {
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

  if (query.q) {
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
  constructor(private readonly prisma: PrismaService) {}

  async search(
    query: ListingSearchQuery,
    userId?: string,
  ): Promise<ListingPage> {
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
}
