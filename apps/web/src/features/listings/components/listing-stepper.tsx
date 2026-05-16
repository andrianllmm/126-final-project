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
import { CheckIcon, LoaderCircleIcon, ArrowLeft, Rocket } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { ListingForm } from '@/features/listings/components/listing-form';
import { SellerTipsCard } from '@/features/listings/components/seller-tips-card';
import { NeedHelpCard } from '@/features/listings/components/need-help-card';
import { PhotoUploadForm } from './listing-form/photo-upload-form';
import { PhotoGuidelines } from './image-guide-card';
import { ProductSummaryCard } from './product-summary-card';
import { ProductSummaryImg } from './product-summary-img';
import { productSummaryDummyData } from './dummy-data';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const steps = [{ title: 'Details' }, { title: 'Photos' }, { title: 'Review' }];

export function Pattern() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.back();
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
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
              <ListingForm />
              <div className="flex justify-between pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  className="px-6"
                  onClick={handleBack}
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  className="px-6"
                  variant="default"
                  onClick={handleNext}
                >
                  Next →
                </Button>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <SellerTipsCard />
              <NeedHelpCard />
            </div>
          </div>
        </StepperContent>

        {/* Step 2 — Photo */}
        <StepperContent value={2}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="mt-4 md:col-span-2">
              <PhotoUploadForm />
              <div className="flex justify-between pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  className="px-6"
                  onClick={handleBack}
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  className="px-6"
                  variant="default"
                  onClick={handleNext}
                >
                  Next →
                </Button>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <PhotoGuidelines />
            </div>
          </div>
        </StepperContent>

        {/* Step 3 — Review */}
        <StepperContent value={3}>
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left: Image Gallery */}
              <div>
                <ProductSummaryImg />
              </div>

              {/* Right: Product Details */}
              <div>
                <ProductSummaryCard {...productSummaryDummyData} />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 px-6"
                onClick={handleBack}
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
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5"
                >
                  Publish Listing
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
