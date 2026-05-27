import { useQuery } from '@tanstack/react-query';
import { getUserReviews } from '../api/reviews-api';

export function useUserReviews(userId: string) {
  return useQuery({
    queryKey: ['reviews', userId],
    queryFn: () => getUserReviews(userId),
    enabled: !!userId,
  });
}
