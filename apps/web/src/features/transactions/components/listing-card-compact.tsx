import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import type { TransactionListing } from '@repo/api';
import { currencyFormatter } from '@/shared/lib/currency-formatter';
import { ListingStatusBadge } from '@/features/listings/components/listing-status-badge';

interface ListingCardCompactProps {
  listing: TransactionListing;
  className?: string;
}

export function ListingCardCompact({
  listing,
  className,
}: ListingCardCompactProps) {
  const firstImage = listing.images[0]?.upload.url;

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className={cn('hover:bg-muted/50 transition-colors', className)}>
        <CardContent className="px-4">
          <div className="flex gap-4">
            <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted shrink-0">
              {firstImage ? (
                <Image
                  src={firstImage}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold line-clamp-2 mb-1">
                {listing.title}
              </h3>
              <p className="text-2xl font-bold">
                {currencyFormatter.format(listing.price)}
              </p>
              <ListingStatusBadge status={listing.status} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
