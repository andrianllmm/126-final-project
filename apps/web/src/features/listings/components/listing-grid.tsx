import type { Listing } from '@repo/api';
import { cn } from '@/shared/lib/utils';
import { ListingCard } from './listing-card';

interface ListingGridProps {
  listings: Listing[];
  className?: string;
}

export function ListingGrid({ listings, className }: ListingGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-3',
        'xl:grid-cols-4',
        className,
      )}
    >
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
