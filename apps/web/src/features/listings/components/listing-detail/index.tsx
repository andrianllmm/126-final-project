'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { ArrowLeft, MapPin, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { currencyFormatter } from '@/shared/lib/currency-formatter';

import { ListingConditionBadge } from '@/features/listings/components/listing-condition-badge';
import { ListingStatusBadge } from '@/features/listings/components/listing-status-badge';
import { getListingById } from '@/features/listings/api/listings-api';
import { UserAvatar } from '@/features/users/components/user-avatar';

import { ListingBreadcrumb } from './listing-detail-breadcrumb';

export function ListingDetail() {
  const params = useParams();
  const router = useRouter();
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

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
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

        {/* Details Section */}
        <div className="space-y-4 lg:col-span-2">
          {/* Badges */}
          <div className="flex gap-2 text-sm">
            <ListingConditionBadge condition={listing.condition} />
            <ListingStatusBadge status={listing.status} />
          </div>

          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <p className="text-3xl font-bold text-primary">
              ₱{listing.price.toFixed(2)}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-muted-foreground">{listing.description}</p>
          </div>

          {/* Meetup Location */}
          {listing.meetupLocation && (
            <div className="rounded-2xl border border-primary/40 bg-muted/50 p-5">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Meetup Location
                  </p>
                  <p className="text-base font-bold">
                    {listing.meetupLocation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Seller Info */}
          <Card className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <UserAvatar
                  name={listing.seller.name}
                  email={listing.seller.email}
                  src={listing.seller.image ?? undefined}
                  sizeClassName="size-12"
                  fallbackClassName="text-sm font-semibold"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">
                    {listing.seller.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Joined{' '}
                    {new Date(listing.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}{' '}
                    • 4.8 Rating
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/profile/${listing.seller.id}`)}
              >
                View Profile
              </Button>
            </div>
          </Card>

          {/* Action Buttons */}
          <Button
            className="w-full py-6 text-base"
            onClick={() => router.push(`/listings/${listing.id}/buy`)}
          >
            Buy Now
          </Button>
          <Button
            variant="outline"
            className="w-full py-6 text-base"
            onClick={() => router.push(`/messages?listingId=${listing.id}`)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message Seller
          </Button>
        </div>
      </div>
    </div>
  );
}
