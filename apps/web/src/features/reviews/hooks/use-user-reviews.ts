import { useQuery } from '@tanstack/react-query';
import { getUserReviews } from '../api/reviews-api';
import type { ReviewWithAuthorList } from '@repo/api';

export function useUserReviews(userId: string) {
  return useQuery<ReviewWithAuthorList>({
    queryKey: ['reviews', userId],
    queryFn: () => getUserReviews(userId),
    enabled: !!userId,
  });
}
