'use client';

import { SlidersHorizontalIcon } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import type { ListingCategory, ListingSearchQuery } from '@repo/api';

import { CategoryMultiSelect } from './category-multi-select';
import { ConditionMultiSelect } from './condition-multi-select';
import { PriceRangeFilter } from './price-range-filter';
import { StatusMultiSelect } from './status-multi-select';

type SearchFiltersSheetProps = {
  categories: ListingCategory[];
  query: ListingSearchQuery;
  onUpdate: (updates: Record<string, string | string[] | undefined>) => void;
  onReset: () => void;
};

export function SearchFiltersSheet({
  categories,
  query,
  onUpdate,
  onReset,
}: SearchFiltersSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontalIcon className="size-4" />
          Filters
        </Button>
      </SheetTrigger>

      <SheetContent
        className="w-full sm:max-w-md"
        overlayClassName="!backdrop-blur-none"
      >
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-6 px-4 pb-4">
          <div className="grid gap-2">
            <Label>Category</Label>

            <CategoryMultiSelect
              categories={categories}
              value={query.category ?? []}
              onChange={(values) =>
                onUpdate({
                  category: values.length ? values : undefined,
                })
              }
              className="w-full"
            />
          </div>

          <div className="grid gap-2">
            <Label>Condition</Label>

            <ConditionMultiSelect
              value={query.condition ?? []}
              onChange={(values) =>
                onUpdate({
                  condition: values.length ? values : undefined,
                })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>

            <StatusMultiSelect
              value={query.status ?? []}
              onChange={(values) =>
                onUpdate({
                  status: values.length ? values : undefined,
                })
              }
            />
          </div>

          <PriceRangeFilter
            minPrice={query.minPrice}
            maxPrice={query.maxPrice}
            onChange={onUpdate}
          />

          <div className="mt-auto flex gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onReset}
            >
              Reset all
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
