'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { cn } from '@/shared/lib/utils';
import { currencyFormatter } from '@/shared/lib/currency-formatter';

import { ListingConditionBadge } from './listing-condition-badge';
import { ListingStatusBadge } from './listing-status-badge';
import { TransactionRequestButton } from '@/features/transactions/components/transaction-request-button';
import { ListingLikeButton } from './listing-like-button';

import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/shared/components/ui/card';
import { Package } from 'lucide-react';

import { ListingStatus, type Listing } from '@repo/api';
import { MessageButton } from '@/features/messaging/components/message-button';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { DeleteListingDialog } from './delete-listing-dialog';

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
  const { user } = useAuth();

  const primaryImage = [...listing.images].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  )[0];

  const isUnavailable = ListingStatus.AVAILABLE != listing.status;
  const isOwner = Boolean(user?.id === listing.seller.id);

  const goToListing = () => router.push(href);

  const goToSeller = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/${listing.seller.id}`);
  };

  const goToEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/listings/${listing.id}/edit`);
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
      </div>

      {/* HEADER */}
      <CardHeader className="mb-1 space-y-1 px-4 pt-4">
        <div className="flex flex-nowrap gap-1 overflow-hidden">
          <div className="shrink-0 whitespace-nowrap">
            <ListingStatusBadge status={listing.status} />
          </div>

          <div className="shrink-0 whitespace-nowrap">
            <ListingConditionBadge condition={listing.condition} />
          </div>

          <div className="shrink-0 whitespace-nowrap">
            <Badge variant="outline">
              {listing.category?.categoryName ?? listing.category?.slug}
            </Badge>
          </div>
        </div>

        <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <h3 className="min-w-0 truncate text-sm font-semibold sm:text-base">
            {listing.title}
          </h3>

          <p className="whitespace-nowrap text-lg font-bold text-primary">
            {currencyFormatter.format(listing.price)}
          </p>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="space-y-3 px-4">
        <p className="truncate text-sm text-muted-foreground">
          {listing.description}
        </p>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="mt-auto flex flex-col gap-2 px-4 pb-4 pt-2">
        <div className="flex w-full items-center justify-between">
          {/* Seller + Message */}
          <div className="flex items-center gap-0">
            <MessageButton
              listingId={listing.id}
              disabled={listing.status === ListingStatus.SOLD}
              size="icon"
              variant="ghost"
              className="size-6 hover:text-primary"
            />

            <Button
              className="truncate text-sm font-medium hover:text-primary"
              size="xs"
              variant="ghost"
              onClick={goToSeller}
            >
              {listing.seller.name}
            </Button>
          </div>

          {/* Like */}
          <ListingLikeButton
            listingId={listing.id}
            likeCount={listing.likeCount}
            isLikedByUser={listing.isLikedByUser}
          />
        </div>

        {/* Actions */}
        <div className="w-full">
          {isOwner ? (
            <div className="grid w-full grid-cols-2 gap-2">
              <Button size="sm" className="w-full" onClick={goToEdit}>
                Edit
              </Button>
              <DeleteListingDialog
                listingId={listing.id}
                listingTitle={listing.title}
                onDeleted={() => router.push('/')}
              />
            </div>
          ) : (
            <TransactionRequestButton listing={listing} />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
