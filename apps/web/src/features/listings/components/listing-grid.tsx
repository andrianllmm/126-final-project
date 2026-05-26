import type { Listing } from '@repo/api';
import { cn } from '@/shared/lib/utils';
import { ListingCard } from './listing-card';
import { ListingCardSkeleton } from './listing-card-skeleton';

interface ListingGridProps {
  listings?: Listing[];
  isLoading?: boolean;
  isError?: boolean;
  skeletonCount?: number;
  className?: string;
}

export function ListingGrid({
  listings,
  isLoading,
  isError,
  skeletonCount = 8,
  className,
}: ListingGridProps) {
  if (isError) {
    return (
      <div className="text-sm text-destructive">Failed to load listings.</div>
    );
  }

  return (
    <div
      className={cn(
        'grid w-full min-w-0 gap-4',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {isLoading ? (
        Array.from({ length: skeletonCount }).map((_, i) => (
          <ListingCardSkeleton key={i} className="w-full min-w-0" />
        ))
      ) : !listings || listings.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No listings available.
        </div>
      ) : (
        listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            className="w-full min-w-0"
          />
        ))
      )}
    </div>
  );
}
