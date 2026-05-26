'use client';

import * as React from 'react';
import { ArrowDownWideNarrowIcon, ArrowUpWideNarrowIcon } from 'lucide-react';

import { Toggle } from '@/shared/components/ui/toggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ListingSearchQuery } from '@repo/api';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'price', label: 'Price' },
  { value: 'title', label: 'Title' },
  { value: 'category', label: 'Category' },
  { value: 'condition', label: 'Condition' },
] as const;

type Props = {
  query: ListingSearchQuery;
  onUpdate: (updates: Record<string, string | undefined>) => void;
};

export function SortControl({ query, onUpdate }: Props) {
  return (
    <div className="flex flex-row items-center gap-0">
      <Select
        value={query.sortBy ?? 'createdAt'}
        onValueChange={(value) => onUpdate({ sortBy: value })}
      >
        <SelectTrigger className="rounded-r-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-fit">
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Toggle
        variant="outline"
        pressed={query.sortOrder === 'asc'}
        onPressedChange={(pressed) =>
          onUpdate({ sortOrder: pressed ? 'asc' : 'desc' })
        }
        className="rounded-l-none"
      >
        {query.sortOrder === 'asc' ? (
          <ArrowUpWideNarrowIcon className="size-4" />
        ) : (
          <ArrowDownWideNarrowIcon className="size-4" />
        )}
      </Toggle>
    </div>
  );
}
