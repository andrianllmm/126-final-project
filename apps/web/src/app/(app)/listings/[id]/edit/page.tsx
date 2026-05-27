'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ListingForm } from '@/features/listings/components/listing-form';
import { AuthRouteGuard } from '@/features/auth/components/auth-route-guard';
import { useListing } from '@/features/listings/hooks/use-listing-detail';
import { useCategories } from '@/features/listings/hooks/use-categories';

import type { ListingFormValues } from '@repo/api';
import { Button } from '@/shared/components/ui/button';

export default function Page() {
  const params = useParams();
  const listingId = params.id as string;

  const { data: listing, isLoading, isError } = useListing(listingId);
  const { data: categories } = useCategories();

  const categoryId = useMemo(() => {
    if (!listing || !categories) return '';

    const listingCategoryId = listing.category?.id;
    if (!listingCategoryId) return '';

    const match = categories.find((c) => c.id === listingCategoryId);
    return match?.id ?? '';
  }, [listing, categories]);

  const initialData = useMemo<Partial<ListingFormValues>>(() => {
    if (!listing) return {};

    return {
      title: listing.title,
      categoryId,
      price: listing.price,
      description: listing.description,
      condition: listing.condition,
    };
  }, [listing, categoryId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading listing...</p>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">Listing not found.</p>
        <Button onClick={() => window.history.back()}>Go back</Button>
      </div>
    );
  }

  const initialPhotos = listing.images
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image, index) => ({
      id: image.id,
      existingImageId: image.id,
      preview: image.upload.url,
      isMain: index === 0,
    }));

  return (
    <AuthRouteGuard>
      <div className="min-h-screen bg-background py-8">
        <ListingForm
          mode="edit"
          listingId={listingId}
          initialData={initialData as ListingFormValues}
          initialPhotos={initialPhotos}
        />
      </div>
    </AuthRouteGuard>
  );
}
