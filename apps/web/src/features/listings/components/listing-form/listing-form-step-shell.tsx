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
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
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
