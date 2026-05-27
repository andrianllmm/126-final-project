import Image from 'next/image';
import Link from 'next/link';

import type { ListingStatus, TransactionListing } from '@repo/api';

import { Card, CardContent } from '@/shared/components/ui/card';
import { currencyFormatter } from '@/shared/lib/currency-formatter';
import { ListingStatusBadge } from '@/features/listings/components/listing-status-badge';
import { cn } from '@/shared/lib/utils';

type CompactListing = {
  id: string;
  title: string;
  price?: number | null;
  status?: ListingStatus | string | null;
  images?: TransactionListing['images'];
};

interface ListingCardCompactProps {
  listing: CompactListing;
  className?: string;
  href?: string;
}

export function ListingCardCompact({
  listing,
  className,
  href = `/listings/${listing.id}`,
}: ListingCardCompactProps) {
  const firstImage = listing.images?.[0]?.upload.url;
  const priceLabel =
    listing.price == null
      ? 'Price unavailable'
      : currencyFormatter.format(listing.price);

  const card = (
    <Card className={cn('hover:bg-muted/50 transition-colors', className)}>
      <CardContent className="px-4">
        <div className="flex gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
            {firstImage ? (
              <Image
                src={firstImage}
                alt={listing.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="mb-1 line-clamp-2 font-semibold">{listing.title}</h3>
            <p className="mb-1 text-2xl font-bold">{priceLabel}</p>

            {listing.status ? (
              <ListingStatusBadge status={listing.status as ListingStatus} />
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!href) {
    return card;
  }

  return <Link href={href}>{card}</Link>;
}
