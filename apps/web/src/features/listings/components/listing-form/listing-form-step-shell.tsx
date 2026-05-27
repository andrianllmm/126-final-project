'use client';

import type { ReactNode } from 'react';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

interface ListingFormStepShellProps {
  children: ReactNode;
  aside: ReactNode;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  busyLabel?: string;
  nextDisabled?: boolean;
}

export function ListingFormStepShell({
  children,
  aside,
  onBack,
  onNext,
  nextLabel,
  busyLabel,
  nextDisabled,
}: ListingFormStepShellProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      <div className="mt-4 md:col-span-2">
        {children}

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={onNext}
            disabled={nextDisabled}
          >
            {nextDisabled && busyLabel ? busyLabel : nextLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-3">{aside}</div>
    </div>
  );
}
