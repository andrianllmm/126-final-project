import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';

import {
  ListingStatus,
  type ListingList,
  type ListingSearchQuery,
} from '@repo/api';

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
      status: query.status?.length
        ? { in: query.status }
        : ListingStatus.AVAILABLE,
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

  async search(query: ListingSearchQuery): Promise<ListingList> {
    const listings = await this.prisma.listing.findMany({
      where: buildWhere(query),
      orderBy: buildOrderBy(
        query.sortBy ?? 'createdAt',
        query.sortOrder ?? 'desc',
      ),
      include: LISTING_INCLUDE,
    });

    return listings.map(mapListing);
  }
}
