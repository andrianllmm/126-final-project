import { apiClient } from '@/shared/lib/api-client';
import type { SearchHistory } from '@repo/api';

export const getSearchHistory = () =>
  apiClient.get<SearchHistory>('/events/search-history');

export const clearSearchHistory = () =>
  apiClient.delete<{ ok: true }>('/events/search-history');

export const logSearchEvent = (q: string) =>
  apiClient.post('/events', { eventType: 'SEARCH', metadata: { q } });
