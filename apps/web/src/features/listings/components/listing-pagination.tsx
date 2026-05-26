'use client';

import * as React from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';

type ListingPaginationProps = {
  page: number;
  totalPages: number;
  getPageHref: (page: number) => string;
  className?: string;
};

function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages]);

  for (const value of [page - 1, page, page + 1]) {
    if (value > 1 && value < totalPages) {
      pages.add(value);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export function ListingPagination({
  page,
  totalPages,
  getPageHref,
  className,
}: ListingPaginationProps) {
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getPageHref(Math.max(1, page - 1))}
            className={page <= 1 ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>

        {visiblePages.map((visiblePage, index) => {
          const previousVisiblePage = visiblePages[index - 1];
          const hasGap =
            previousVisiblePage && visiblePage - previousVisiblePage > 1;

          return (
            <React.Fragment key={visiblePage}>
              {hasGap ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}

              <PaginationItem>
                <PaginationLink
                  href={getPageHref(visiblePage)}
                  isActive={visiblePage === page}
                >
                  {visiblePage}
                </PaginationLink>
              </PaginationItem>
            </React.Fragment>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={getPageHref(Math.min(totalPages, page + 1))}
            className={
              page >= totalPages ? 'pointer-events-none opacity-50' : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
