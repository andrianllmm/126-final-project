import { useQuery } from '@tanstack/react-query';
import { getSimilarListings } from '../api/listings-api';

export function useSimilarListings(id: string) {
  return useQuery({
    queryKey: ['listings', id, 'similar'],
    queryFn: () => getSimilarListings(id),
    enabled: Boolean(id),
  });
}
