'use client';

import { ListingGrid } from '@/features/listings/components/listing-grid';
import { useSimilarListings } from '@/features/listings/hooks/use-similar-listings';

interface SimilarListingsProps {
  listingId: string;
}

export function SimilarListings({ listingId }: SimilarListingsProps) {
  const { data: listings, isLoading, isError } = useSimilarListings(listingId);

  if (!isLoading && !isError && (!listings || listings.length === 0)) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="mb-4 text-xl font-bold">Similar Listings</h2>
      <ListingGrid
        listings={listings}
        isLoading={isLoading}
        isError={isError}
        skeletonCount={4}
      />
    </div>
  );
}
