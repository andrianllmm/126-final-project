import { apiClient } from '@/shared/lib/api-client';
import { type ListingPage, type ListingSearchQuery } from '@repo/api';

export const getSearchListings = (query: ListingSearchQuery) =>
  apiClient.get<ListingPage>('/search', {
    params: query,
  });
