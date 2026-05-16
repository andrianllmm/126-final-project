import { ListingStatus } from '@repo/api';

export const LISTING_STATUS_TRANSITIONS: Record<
  ListingStatus,
  readonly ListingStatus[]
> = {
  [ListingStatus.DRAFT]: [ListingStatus.AVAILABLE, ListingStatus.ARCHIVED],

  [ListingStatus.AVAILABLE]: [
    ListingStatus.RESERVED,
    ListingStatus.SOLD,
    ListingStatus.ARCHIVED,
  ],

  [ListingStatus.RESERVED]: [
    ListingStatus.AVAILABLE,
    ListingStatus.SOLD,
    ListingStatus.ARCHIVED,
  ],

  [ListingStatus.SOLD]: [ListingStatus.ARCHIVED],

  [ListingStatus.ARCHIVED]: [],
};
