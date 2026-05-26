import { useQuery } from '@tanstack/react-query';
import { getListings } from '../api/listings-api';
import type { ListingPaginationQuery } from '@repo/api';

export function useListings(query: ListingPaginationQuery) {
  return useQuery({
    queryKey: ['listings', query],
    queryFn: () => getListings(query),
  });
}
