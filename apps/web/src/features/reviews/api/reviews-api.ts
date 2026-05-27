import { apiClient } from '@/shared/lib/api-client';
import type { CreateReviewInput, Review, ReviewList } from '@repo/api';

export const createReview = (input: CreateReviewInput) =>
  apiClient.post<Review, CreateReviewInput>('/reviews', input);

export const getUserReviews = (userId: string) =>
  apiClient.get<ReviewList>(`/reviews/user/${userId}`);

export const getMyReviews = () => apiClient.get<ReviewList>('/reviews/me');
