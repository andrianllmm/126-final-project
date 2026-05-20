'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { cn } from '@/shared/lib/utils';
import { currencyFormatter } from '@/shared/lib/currency-formatter';

import { ListingConditionBadge } from './listing-condition-badge';
import { ListingStatusBadge } from './listing-status-badge';
import { TransactionRequestButton } from '@/features/transactions/components/transaction-request-button';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/shared/components/ui/card';
import { MapPin, MessageCircleIcon, Package } from 'lucide-react';

import { ListingStatus, type Listing } from '@repo/api';

interface ListingCardProps {
  listing: Listing;
  href?: string;
  className?: string;
}

export function ListingCard({
  listing,
  href = `/listings/${listing.id}`,
  className,
}: ListingCardProps) {
  const router = useRouter();

  const primaryImage = [...listing.images].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  )[0];

  const isUnavailable = ListingStatus.AVAILABLE != listing.status;

  const goToListing = () => router.push(href);

  const goToSeller = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/${listing.seller.id}`);
  };

  const goToMessages = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/messages?listingId=${listing.id}`);
  };

  return (
    <Card
      onClick={goToListing}
      className={cn(
        'cursor-pointer overflow-hidden border bg-background p-0 gap-1',
        'transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-lg hover:bg-muted/50',
        isUnavailable && 'opacity-80',
        className,
      )}
    >
      {/* IMAGE */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {primaryImage ? (
          <Image
            src={primaryImage.upload.url}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-[1.05]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Package className="h-10 w-10" />
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <ListingConditionBadge condition={listing.condition} />
          <ListingStatusBadge status={listing.status} />
        </div>
      </div>

      {/* HEADER */}
      <CardHeader className="space-y-3 px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-semibold sm:text-base">
            {listing.title}
          </h3>

          <p className="shrink-0 text-lg font-bold text-primary">
            {currencyFormatter.format(listing.price)}
          </p>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="space-y-3 px-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {listing.description}
        </p>

        <div className="flex items-center justify-between">
          {/* Seller + Message */}
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="size-6 hover:text-primary"
              onClick={goToMessages}
            >
              <MessageCircleIcon />
            </Button>

            <button
              className="truncate text-sm font-medium hover:text-primary"
              onClick={goToSeller}
            >
              {listing.seller.name}
            </button>
          </div>

          {/* Meetup location */}
          {listing.meetupLocation && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{listing.meetupLocation}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="px-4 pb-4 pt-4">
        <TransactionRequestButton listing={listing} />
      </CardFooter>
    </Card>
  );
}
