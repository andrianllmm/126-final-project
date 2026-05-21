'use client';

import { ListingGrid } from '@/features/listings/components/listing-grid';
import { useListings } from '@/features/listings/hooks/use-listings';

export default function Page() {
  const { data, isLoading, isError } = useListings();

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading listings...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-sm text-destructive">
        Failed to load listings.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        No listings available.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ListingGrid listings={data} />
    </div>
  );
}
