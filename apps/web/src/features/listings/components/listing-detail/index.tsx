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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images Section */}
        <div className="flex flex-col gap-4">
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
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <p className="text-3xl font-bold text-primary">
              {currencyFormatter.format(listing.price)}
            </p>

            {/* Badges */}
            <div className="flex gap-2 pt-4">
              <ListingConditionBadge condition={listing.condition} />
              <ListingStatusBadge status={listing.status} />
            </div>

            <p className="text-muted-foreground pt-4">{listing.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
