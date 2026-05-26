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
import { ListingConditionBadge } from '@/features/listings/components/listing-condition-badge';
import { ListingCondition } from '@repo/api';
import { cn } from '@/shared/lib/utils';

type ConditionMultiSelectProps = {
  value?: string[];
  onChange: (value: string[]) => void;
  className?: string;
};

export function ConditionMultiSelect({
  value = [],
  onChange,
  className,
}: ConditionMultiSelectProps) {
  return (
    <MultiSelect values={value} onValuesChange={onChange}>
      <MultiSelectTrigger className={cn('w-full', className)}>
        <MultiSelectValue
          placeholder="Any condition"
          badgeClassName="border-0 p-0"
        />
      </MultiSelectTrigger>

      <MultiSelectContent
        search={{
          placeholder: 'Search conditions...',
          emptyMessage: 'No conditions found.',
        }}
      >
        <MultiSelectGroup>
          {Object.values(ListingCondition).map((condition) => (
            <MultiSelectItem
              key={condition}
              value={condition}
              badgeLabel={<ListingConditionBadge condition={condition} />}
            >
              <ListingConditionBadge condition={condition} />
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
}
