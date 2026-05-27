import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';

import type { Listing } from '@repo/api';

export const LISTING_INCLUDE = {
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

type ListingWithRelations = Prisma.ListingGetPayload<{
  include: typeof LISTING_INCLUDE;
}>;

type ListingMeta = {
  likeCount: number;
  isLikedByUser: boolean;
};

function mapListing(listing: ListingWithRelations, meta: ListingMeta): Listing {
  return {
    ...listing,
    price: Number(listing.price),
    likeCount: meta.likeCount,
    isLikedByUser: meta.isLikedByUser,
    seller: {
      ...listing.seller,
      name: listing.seller.name ?? '',
    },
  };
}

async function getListingMeta(
  prisma: PrismaService,
  listingIds: string[],
  userId?: string,
) {
  if (listingIds.length === 0) {
    return {
      likeCounts: new Map<string, number>(),
      likedListingIds: new Set<string>(),
    };
  }

  const [counts, likedListings] = await Promise.all([
    prisma.likedListing.groupBy({
      by: ['listingId'],
      where: {
        listingId: { in: listingIds },
      },
      _count: {
        listingId: true,
      },
    }),
    userId
      ? prisma.likedListing.findMany({
          where: {
            userId,
            listingId: { in: listingIds },
          },
          select: {
            listingId: true,
          },
        })
      : Promise.resolve([] as { listingId: string }[]),
  ]);

  return {
    likeCounts: new Map(
      counts.map((entry) => [entry.listingId, entry._count.listingId]),
    ),
    likedListingIds: new Set(likedListings.map((entry) => entry.listingId)),
  };
}

export async function decorateListings(
  prisma: PrismaService,
  listings: ListingWithRelations[],
  userId?: string,
): Promise<Listing[]> {
  const { likeCounts, likedListingIds } = await getListingMeta(
    prisma,
    listings.map((listing) => listing.id),
    userId,
  );

  return listings.map((listing) =>
    mapListing(listing, {
      likeCount: likeCounts.get(listing.id) ?? 0,
      isLikedByUser: userId ? likedListingIds.has(listing.id) : false,
    }),
  );
}

export async function decorateListing(
  prisma: PrismaService,
  listing: ListingWithRelations,
  userId?: string,
): Promise<Listing> {
  const results = await decorateListings(prisma, [listing], userId);

  if (!results[0]) {
    throw new Error('decorateListing: expected a listing but got empty result');
  }

  return results[0];
}
