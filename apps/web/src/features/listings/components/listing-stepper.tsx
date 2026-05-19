'use client';

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/shared/components/ui/stepper';
import {
  CheckIcon,
  LoaderCircleIcon,
  ArrowLeft,
  ArrowRight,
  Rocket,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { ListingForm } from '@/features/listings/components/listing-form';
import { SellerTipsCard } from '@/features/listings/components/seller-tips-card';
import { NeedHelpCard } from '@/features/listings/components/need-help-card';
import { PhotoUploadForm } from './listing-form/photo-upload-form';
import { PhotoGuidelines } from './image-guide-card';
import { ProductSummaryCard } from './product-summary-card';
import { ProductSummaryImg } from './product-summary-img';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateListing } from '../hooks/use-create-listing';
import { useAddListingImages } from '../hooks/use-listing-images';
import type { ListingFormHandle } from './listing-form';
import type { CategoryValue } from '../lib/listing-schema';
import { ListingCondition } from '@repo/api';

const steps = [{ title: 'Details' }, { title: 'Photos' }, { title: 'Review' }];

interface FormData {
  productName: string;
  category: CategoryValue;
  price: string;
  meetupLocation: string;
  description: string;
}

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  isMain?: boolean;
}

export function Pattern() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  // ─── Hooks ────────────────────────────────────────────────────────────────
  const createListingMutation = useCreateListing();
  const addImagesMutation = useAddListingImages();

  const isSubmitting =
    createListingMutation.isPending || addImagesMutation.isPending;

  const [publishError, setPublishError] = useState<string | null>(null);
  const [validatingStep1, setValidatingStep1] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const listingFormRef = useRef<ListingFormHandle>(null);

  const [formData, setFormData] = useState<FormData>({
    productName: '',
    category: '' as CategoryValue,
    price: '',
    meetupLocation: '',
    description: '',
  });
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  // ─── Step navigation ──────────────────────────────────────────────────────
  const handleNextFromStep1 = async () => {
    setValidatingStep1(true);
    setPhotoError(null);
    try {
      const isValid = await listingFormRef.current?.triggerValidation();
      if (isValid) {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      }
    } finally {
      setValidatingStep1(false);
    }
  };

  const handleNextFromStep2 = () => {
    if (photos.length === 0) {
      setPhotoError('Please upload at least one photo before proceeding.');
      return;
    }
    setPhotoError(null);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      handleNextFromStep1();
    } else if (currentStep === 2) {
      handleNextFromStep2();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.back();
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  // ─── Publish ──────────────────────────────────────────────────────────────
  const handlePublish = async () => {
    try {
      setPublishError(null);

      // 1. Create the listing record
      const newListing = await createListingMutation.mutateAsync({
        title: formData.productName,
        categoryId: formData.category,
        condition: ListingCondition.GOOD,
        price: parseFloat(formData.price) || 0,
        meetupLocation: formData.meetupLocation,
        description: formData.description,
      });

      // 2. Upload photos if any were selected
      if (photos.length > 0) {
        const files = photos.map((p) => p.file);
        await addImagesMutation.mutateAsync({
          listingId: newListing.id,
          files,
        });
      }

      // 3. Navigate to the new listing's detail page (or listings index)
      router.push(`/listings/${newListing.id}`);
    } catch (err) {
      setPublishError(
        err instanceof Error ? err.message : 'Failed to publish listing.',
      );
    }
  };

  return (
    <Stepper
      value={currentStep}
      indicators={{
        completed: <CheckIcon className="size-3.5" />,
        loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
      }}
      className="w-full space-y-8"
    >
      <div className="flex justify-center">
        <StepperNav className="max-w-md w-full">
          {steps.map((step, index) => (
            <StepperItem key={index} step={index + 1} className="relative">
              <StepperTrigger className="flex justify-start gap-1.5">
                <StepperIndicator>{index + 1}</StepperIndicator>
                <StepperTitle>{step.title}</StepperTitle>
              </StepperTrigger>

              {steps.length > index + 1 && (
                <StepperSeparator className="group-data-[state=completed]/step:bg-primary md:mx-2.5" />
              )}
            </StepperItem>
          ))}
        </StepperNav>
      </div>

      <StepperPanel>
        {/* Step 1 — Details */}
        <StepperContent value={1}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="mt-4 md:col-span-2">
              <ListingForm
                ref={listingFormRef}
                initialData={formData}
                onChange={setFormData}
              />
              <div className="flex justify-between pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  className="px-6"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  className="px-6"
                  variant="default"
                  onClick={handleNext}
                  disabled={validatingStep1}
                >
                  {validatingStep1 ? 'Validating...' : 'Next'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <SellerTipsCard />
              <NeedHelpCard />
            </div>
          </div>
        </StepperContent>

        {/* Step 2 — Photos */}
        <StepperContent value={2}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="mt-4 md:col-span-2">
              <PhotoUploadForm photos={photos} onChange={setPhotos} />
              <div className="flex justify-between pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  className="px-6"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  className="px-6"
                  variant="default"
                  onClick={handleNext}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <PhotoGuidelines />
              {photoError && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">
                    {photoError}
                  </p>
                </div>
              )}
            </div>
          </div>
        </StepperContent>

        {/* Step 3 — Review */}
        <StepperContent value={3}>
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <ProductSummaryImg photos={photos} />
              </div>
              <div>
                <ProductSummaryCard
                  productTitle={formData.productName}
                  category={formData.category}
                  price={formData.price}
                  description={formData.description}
                  meetupLocation={formData.meetupLocation}
                />
              </div>
            </div>

            {publishError && (
              <p className="mt-4 text-sm text-destructive">{publishError}</p>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 px-6"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Almost there! Your listing is ready to soar.
                </p>
                <Button
                  type="button"
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5"
                >
                  {isSubmitting ? 'Publishing…' : 'Publish Listing'}
                  <Rocket className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </StepperContent>
      </StepperPanel>
    </Stepper>
  );
}
