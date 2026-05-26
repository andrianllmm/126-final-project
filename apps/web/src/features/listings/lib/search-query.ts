import {
  ListingCondition,
  ListingStatus,
  type ListingSearchQuery,
} from '@repo/api';

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

    category: query.category.length ? query.category : undefined,

    condition: condition.length ? condition : undefined,
    status: status.length ? status : undefined,

    minPrice: query.minPrice ? Number(query.minPrice) : undefined,
    maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
  };
}
