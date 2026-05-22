'use client';

'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Pattern } from '@/features/listings/components/listing-stepper';
import { useListing } from '@/features/listings/hooks/use-listing-detail';
import {
  ListingFormValues,
  CATEGORIES,
} from '@/features/listings/lib/listing-schema';
import { Button } from '@/shared/components/ui/button';

export default function Page() {
  const params = useParams();
  const listingId = params.id as string;
  const { data: listing, isLoading, isError } = useListing(listingId);

  const initialData = useMemo<Partial<ListingFormValues>>(() => {
    if (!listing) return {};

    const rawCategory = listing.category;
    let categoryId = '';

    if (typeof rawCategory === 'string') {
      categoryId = rawCategory;
    } else if (rawCategory) {
      categoryId =
        rawCategory.id ??
        rawCategory.value ??
        rawCategory.slug ??
        rawCategory.name ??
        '';
    }

    if (
      categoryId &&
      !CATEGORIES.some((category) => category.value === categoryId)
    ) {
      const matchedCategory = CATEGORIES.find(
        (category) =>
          category.label.toLowerCase() === String(categoryId).toLowerCase(),
      );
      categoryId = matchedCategory?.value ?? '';
    }

    return {
      title: listing.title,
      categoryId,
      price: listing.price,
      meetupLocation: listing.meetupLocation ?? '',
      description: listing.description,
      condition: listing.condition,
    };
  }, [listing]);

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
    <div className="min-h-screen bg-background py-8">
      <Pattern
        mode="edit"
        listingId={listingId}
        initialData={initialData as ListingFormValues}
        initialPhotos={initialPhotos}
      />
    </div>
  );
}
