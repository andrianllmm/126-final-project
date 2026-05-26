'use client';

import * as React from 'react';
import { BrushCleaningIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { type ListingCategory, type ListingSearchQuery } from '@repo/api';

import { SearchFiltersSheet } from './search-filters-sheet';
import { SortControl } from './sort-control';
import { SearchInput } from './search-input';

type SearchToolbarProps = {
  categories: ListingCategory[];
  query: ListingSearchQuery;
  onUpdate: (updates: Record<string, string | string[] | undefined>) => void;
  onReset: () => void;
  className?: string;
};

export function SearchToolbar({
  categories,
  query,
  onUpdate,
  onReset,
  className,
}: SearchToolbarProps) {
  const [, startTransition] = React.useTransition();

  const [localQ, setLocalQ] = React.useState(query.q ?? '');
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setLocalQ(query.q ?? '');
  }, [query.q]);

  const hasQuery = Boolean(
    query.q ||
    (query.category && query.category.length > 0) ||
    (query.condition && query.condition.length > 0) ||
    (query.status && query.status.length > 0) ||
    query.minPrice !== undefined ||
    query.maxPrice !== undefined ||
    query.sortBy !== 'createdAt' ||
    query.sortOrder !== 'desc',
  );

  const onSearchChange = (value: string) => {
    setLocalQ(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        onUpdate({ q: value || undefined });
      });
    }, 300);
  };

  const handleReset = () => {
    setLocalQ('');
    startTransition(() => onReset());
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchInput
            value={localQ}
            onChange={onSearchChange}
            placeholder="Search listings"
          />
        </div>

        {hasQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleReset}
          >
            <BrushCleaningIcon className="size-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <SortControl query={query} onUpdate={onUpdate} />

        <SearchFiltersSheet
          categories={categories}
          query={query}
          onUpdate={onUpdate}
          onReset={onReset}
        />
      </div>
    </div>
  );
}
