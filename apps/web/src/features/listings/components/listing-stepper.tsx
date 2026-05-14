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
import { CheckIcon, LoaderCircleIcon } from 'lucide-react';
import { ListingForm } from '@/features/listings/components/listing-form';
import { SellerTipsCard } from '@/features/listings/components/seller-tips-card';
import { NeedHelpCard } from '@/features/listings/components/need-help-card';

const steps = [{ title: 'Details' }, { title: 'Pricing' }, { title: 'Review' }];

export function Pattern() {
  return (
    <Stepper
      defaultValue={1}
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
            <div className="-mt-4 md:col-span-2">
              <ListingForm />
            </div>
            <div className="mt-4 space-y-3">
              <SellerTipsCard />
              <NeedHelpCard />
            </div>
          </div>
        </StepperContent>

        {/* Step 2 — Pricing */}
        <StepperContent value={2}>
          <div className="max-w-5xl mx-auto px-4 md:px-6" />
        </StepperContent>

        {/* Step 3 — Review */}
        <StepperContent value={3}>
          <div className="max-w-5xl mx-auto px-4 md:px-6" />
        </StepperContent>
      </StepperPanel>
    </Stepper>
  );
}
