'use client';

import { Rocket } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

import { ProductSummaryCard } from './product-summary-card';
import { ProductSummaryImg } from '../product-summary-img';
import type { ListingFormValues } from '@repo/api';
import type { UploadedPhoto } from './photo-upload-types';
import { ArrowLeft } from 'lucide-react';

interface ListingReviewStepProps {
  formData: ListingFormValues;
  photos: UploadedPhoto[];
  categoryName?: string;
  publishError?: string | null;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
  onBack: () => void;
  onPublish: () => void;
}

export function ListingReviewStep({
  formData,
  photos,
  categoryName,
  publishError,
  isSubmitting,
  mode,
  onBack,
  onPublish,
}: ListingReviewStepProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <ProductSummaryImg photos={photos} />
        </div>
        <div>
          <ProductSummaryCard
            productTitle={formData.title}
            categoryName={categoryName}
            price={formData.price}
            description={formData.description}
            condition={formData.condition || undefined}
          />
        </div>
      </div>

      {publishError && (
        <p className="mt-4 text-sm text-destructive">{publishError}</p>
      )}

      <div className="mt-8 flex items-center justify-between pt-5">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft />
          <span>Back</span>
        </Button>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={onPublish}
            disabled={isSubmitting}
            className="flex items-center gap-2 font-semibold"
          >
            {isSubmitting
              ? mode === 'edit'
                ? 'Saving…'
                : 'Publishing…'
              : mode === 'edit'
                ? 'Save Changes'
                : 'Publish Listing'}
            <Rocket className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
