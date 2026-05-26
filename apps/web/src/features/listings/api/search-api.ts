import { apiClient } from '@/shared/lib/api-client';
import { type ListingList, type ListingSearchQuery } from '@repo/api';

export const getSearchListings = (query: ListingSearchQuery) =>
  apiClient.get<ListingList>('/search', {
    params: query,
  });
