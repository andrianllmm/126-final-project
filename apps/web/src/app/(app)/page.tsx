'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { ListingGrid } from '@/features/listings/components/listing-grid';
import { ListingPagination } from '@/features/listings/components/listing-pagination';
import { useListings } from '@/features/listings/hooks/use-listings';
import {
  buildListingPaginationQuery,
  setQueryParams,
} from '@/features/listings/lib/search-query';

export default function Page() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paginationQuery = buildListingPaginationQuery(searchParams);
  const { data, isLoading, isError } = useListings(paginationQuery);

  const buildPageHref = (page: number) =>
    setQueryParams(pathname, searchParams, { page: String(page) });

  return (
    <div className="w-full p-4">
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
