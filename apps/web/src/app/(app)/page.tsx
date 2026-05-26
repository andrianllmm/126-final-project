'use client';

import { ListingGrid } from '@/features/listings/components/listing-grid';
import { useListings } from '@/features/listings/hooks/use-listings';

export default function Page() {
  const { data, isLoading, isError } = useListings();

  return (
    <div className="w-full p-4">
      <ListingGrid
        listings={data ?? []}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
