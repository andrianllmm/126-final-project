'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';

import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

import { ListingConditionBadge } from '@/features/listings/components/listing-condition-badge';
import { ListingStatusBadge } from '@/features/listings/components/listing-status-badge';
import { DeleteListingDialog } from '@/features/listings/components/delete-listing-dialog';
import { getListingById } from '@/features/listings/api/listings-api';
import { UserCardCompact } from '@/features/users/components/user-card-compact';
import { ListingBreadcrumb } from './listing-detail-breadcrumb';
import { MessageButton } from '@/features/messaging/components/message-button';
import { currencyFormatter } from '@/shared/lib/currency-formatter';

export function ListingDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const listingId = params.id as string;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    data: listing,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => getListingById(listingId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-destructive">Listing not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const sortedImages = [...listing.images].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  const primaryImage = sortedImages[selectedImageIndex] || sortedImages[0];
  const isOwner = user?.id === listing.seller.id;

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="mb-6">
        <ListingBreadcrumb />
      </div>

      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Images Section */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          {primaryImage && (
            <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-muted">
              <Image
                key={primaryImage.id}
                src={primaryImage.upload.url}
                alt={listing.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Thumbnails */}
          {sortedImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {sortedImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-md bg-muted transition-all ${
                    selectedImageIndex === index
                      ? 'ring-2 ring-primary'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image.upload.url}
                    alt="thumbnail"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 lg:col-span-2">
          {/* Details Section */}
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex gap-2 text-sm">
              <ListingConditionBadge condition={listing.condition} />
              <ListingStatusBadge status={listing.status} />
            </div>

            {/* Title*/}
            <h1 className="text-3xl font-bold">{listing.title}</h1>

            {/* Category */}
            {listing.category && (
              <Badge variant="outline">
                {listing.category?.categoryName ?? listing.category?.slug}
              </Badge>
            )}

            {/* Price */}
            <p className="text-3xl font-bold text-primary">
              {currencyFormatter.format(listing.price)}
            </p>

            {/* Description */}
            <p className="text-muted-foreground">{listing.description}</p>

            {/* Seller Info */}
            <UserCardCompact user={listing.seller} />
          </div>

          {/* Action Buttons */}
          <div>
            {isOwner ? (
              <div className="grid w-full grid-cols-2 gap-2">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => router.push(`/listings/${listing.id}/edit`)}
                >
                  Edit Listing
                </Button>
                <DeleteListingDialog
                  listingId={listing.id}
                  listingTitle={listing.title}
                  triggerLabel="Delete Listing"
                  onDeleted={() => router.push('/')}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <MessageButton
                  listingId={listing.id}
                  size="default"
                  variant="outline"
                  className="w-full"
                >
                  Message Seller
                </MessageButton>
                <Button
                  className="w-full py-6 text-base"
                  onClick={() => router.push(`/listings/${listing.id}/buy`)}
                >
                  Buy Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
