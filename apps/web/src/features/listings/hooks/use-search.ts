import { useQuery } from '@tanstack/react-query';

import { getSearchListings } from '../api/search-api';
import type { ListingSearchQuery } from '@repo/api';

export function useSearchListings(query: ListingSearchQuery) {
  return useQuery({
    queryKey: ['listings', 'search', query],
    queryFn: () => getSearchListings(query),
  });
}
