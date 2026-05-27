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

function resolveCategoryValue(category: unknown) {
  const candidates: unknown[] = [];

  if (typeof category === 'string') {
    candidates.push(category);
  } else if (category && typeof category === 'object') {
    const categoryRecord = category as Record<string, unknown>;

    candidates.push(
      categoryRecord.slug,
      categoryRecord.value,
      categoryRecord.categoryName,
      categoryRecord.name,
      categoryRecord.label,
      categoryRecord.id,
    );
  }

  for (const candidate of candidates) {
    if (typeof candidate !== 'string' || !candidate) {
      continue;
    }

    const normalizedCandidate = candidate.toLowerCase();
    const matchedCategory = CATEGORIES.find(
      ({ value, label }) =>
        value.toLowerCase() === normalizedCandidate ||
        label.toLowerCase() === normalizedCandidate,
    );

    if (matchedCategory) {
      return matchedCategory.value;
    }
  }

  return '';
}

export default function Page() {
  const params = useParams();
  const listingId = params.id as string;
  const { data: listing, isLoading, isError } = useListing(listingId);

  const initialData = useMemo<Partial<ListingFormValues>>(() => {
    if (!listing) return {};

    return {
      title: listing.title,
      categoryId: resolveCategoryValue(listing.category),
      price: listing.price,
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
