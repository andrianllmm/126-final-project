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
    </Stepper>
  );
}
