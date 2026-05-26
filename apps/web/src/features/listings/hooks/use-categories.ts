import { useQuery } from '@tanstack/react-query';

import { getCategories } from '../api/listings-api';

export function useCategories() {
  return useQuery({
    queryKey: ['listings', 'categories'],
    queryFn: getCategories,
  });
}
