import {
  ListingCondition,
  ListingStatus,
  type ListingSearchQuery,
  type ListingPaginationQuery,
} from '@repo/api';

const DEFAULT_LISTINGS_LIMIT = 12;

function parsePositiveInteger(value: string | null, fallback: number) {
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function setQueryParams(
  pathname: string,
  searchParams: URLSearchParams,
  updates: Record<string, string | string[] | undefined>,
) {
  const params = new URLSearchParams(searchParams.toString());

  for (const [key, value] of Object.entries(updates)) {
    params.delete(key);

    if (value === undefined) continue;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) params.append(key, v);
      });
      continue;
    }

    if (value !== '') {
      params.set(key, value);
    }
  }

  const next = params.toString();
  return next ? `${pathname}?${next}` : pathname;
}

export function buildListingSearchQuery(
  searchParams: URLSearchParams,
): ListingSearchQuery {
  const pagination = buildListingPaginationQuery(searchParams);

  const query = {
    q: searchParams.get('q') ?? '',
    sortBy: searchParams.get('sortBy') ?? 'createdAt',
    sortOrder: searchParams.get('sortOrder') ?? 'desc',

    category: searchParams.getAll('category'),
    condition: searchParams.getAll('condition'),
    status: searchParams.getAll('status'),

    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
  };

  const condition = query.condition.filter((value) =>
    Object.values(ListingCondition).includes(value as any),
  ) as NonNullable<ListingSearchQuery['condition']>;

  const status = query.status.filter((value) =>
    Object.values(ListingStatus).includes(value as any),
  ) as NonNullable<ListingSearchQuery['status']>;

  return {
    q: query.q || undefined,
    sortBy: query.sortBy as ListingSearchQuery['sortBy'],
    sortOrder: query.sortOrder as ListingSearchQuery['sortOrder'],
    page: pagination.page,
    limit: pagination.limit,

    category: query.category.length ? query.category : undefined,

    condition: condition.length ? condition : undefined,
    status: status.length ? status : undefined,

    minPrice: query.minPrice ? Number(query.minPrice) : undefined,
    maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
  };
}

export function buildListingPaginationQuery(
  searchParams: URLSearchParams,
): ListingPaginationQuery {
  return {
    page: parsePositiveInteger(searchParams.get('page'), 1),
    limit: parsePositiveInteger(
      searchParams.get('limit'),
      DEFAULT_LISTINGS_LIMIT,
    ),
  };
}
