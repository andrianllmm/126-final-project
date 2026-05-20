import type {
  Listing,
  CreateListingInput,
  UpdateListingInput,
} from '@repo/api';

export interface ListingPhoto {
  id: string;
  file: File;
  preview: string;
  isMain?: boolean;
}

export type { Listing, CreateListingInput, UpdateListingInput };
