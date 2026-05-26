import { useQuery } from '@tanstack/react-query';

import { getSearchCategories } from '../api/listings-api';

export function useCategories() {
  return useQuery({
    queryKey: ['listings', 'categories'],
    queryFn: getSearchCategories,
  });
}
