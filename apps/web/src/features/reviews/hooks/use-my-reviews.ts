import { useQuery } from '@tanstack/react-query';
import { getMyReviews } from '../api/reviews-api';

export function useMyReviews(enabled = true) {
  return useQuery({
    queryKey: ['reviews', 'me'],
    queryFn: getMyReviews,
    enabled,
  });
}
