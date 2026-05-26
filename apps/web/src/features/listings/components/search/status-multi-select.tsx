'use client';

import * as React from 'react';

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/shared/components/ui/multi-select';
import { ListingStatusBadge } from '@/features/listings/components/listing-status-badge';
import { ListingStatus } from '@repo/api';
import { cn } from '@/shared/lib/utils';

type StatusMultiSelectProps = {
  value?: string[];
  onChange: (value: string[]) => void;
  className?: string;
};

export function StatusMultiSelect({
  value = [],
  onChange,
  className,
}: StatusMultiSelectProps) {
  return (
    <MultiSelect values={value} onValuesChange={onChange}>
      <MultiSelectTrigger className={cn('w-full', className)}>
        <MultiSelectValue
          placeholder="Any status"
          badgeClassName="border-0 p-0"
        />
      </MultiSelectTrigger>

      <MultiSelectContent
        search={{
          placeholder: 'Search statuses...',
          emptyMessage: 'No statuses found.',
        }}
      >
        <MultiSelectGroup>
          {Object.values(ListingStatus).map((status) => (
            <MultiSelectItem
              key={status}
              value={status}
              badgeLabel={<ListingStatusBadge status={status} />}
            >
              <ListingStatusBadge status={status} />
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
}
