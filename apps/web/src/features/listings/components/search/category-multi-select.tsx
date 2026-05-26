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
import { cn } from '@/shared/lib/utils';
import type { ListingCategory } from '@repo/api';

type CategoryMultiSelectProps = {
  categories: ListingCategory[];
  value?: string[];
  onChange: (value: string[]) => void;
  className?: string;
};

export function CategoryMultiSelect({
  categories,
  value = [],
  onChange,
  className,
}: CategoryMultiSelectProps) {
  return (
    <MultiSelect values={value} onValuesChange={onChange}>
      <MultiSelectTrigger className={cn('w-full justify-between', className)}>
        <MultiSelectValue placeholder="All categories" />
      </MultiSelectTrigger>

      <MultiSelectContent
        search={{
          placeholder: 'Search categories...',
          emptyMessage: 'No categories found.',
        }}
      >
        <MultiSelectGroup>
          {categories.map((category) => (
            <MultiSelectItem
              key={category.id}
              value={category.slug}
              badgeLabel={category.categoryName}
            >
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">
                  {category.categoryName}
                </span>
              </div>
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
}
