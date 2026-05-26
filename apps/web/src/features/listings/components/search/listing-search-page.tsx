'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ListingGrid } from '@/features/listings/components/listing-grid';
import { ListingPagination } from '@/features/listings/components/listing-pagination';
import { useSearchListings } from '../../hooks/use-search';
import { useCategories } from '../../hooks/use-categories';
import { SearchToolbar } from './search-toolbar';
import {
  buildListingSearchQuery,
  setQueryParams,
} from '../../lib/search-query';

export function ListingSearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: categories = [] } = useCategories();

  const searchQuery = buildListingSearchQuery(searchParams);

  const { data, isLoading, isError } = useSearchListings(searchQuery);

  const updateQuery = (
    updates: Record<string, string | string[] | undefined>,
  ) => {
    const shouldResetPage = !Object.prototype.hasOwnProperty.call(
      updates,
      'page',
    );
    const nextUpdates = shouldResetPage ? { ...updates, page: '1' } : updates;

    router.replace(setQueryParams(pathname, searchParams, nextUpdates), {
      scroll: false,
    });
  };

  const buildPageHref = (page: number) =>
    setQueryParams(pathname, searchParams, { page: String(page) });

  const reset = React.useCallback(() => {
    router.replace('/search', { scroll: false });
  }, [router]);

  return (
    <div className="w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <SearchToolbar
        categories={categories}
        query={searchQuery}
        onUpdate={updateQuery}
        onReset={reset}
        className="mb-4"
      />

      <div className="mb-4 flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          {isLoading
            ? 'Loading listings...'
            : `${data?.meta.total ?? 0} listing${data?.meta.total === 1 ? '' : 's'} found`}
        </p>
      </div>

      <ListingGrid
        listings={data?.data}
        isLoading={isLoading}
        isError={isError}
      />

      {data && data.meta.totalPages > 1 ? (
        <ListingPagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          getPageHref={buildPageHref}
          className="mt-6"
        />
      ) : null}
    </div>
  );
}
