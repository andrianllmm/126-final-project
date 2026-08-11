'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  clearSearchHistory,
  getSearchHistory,
  logSearchEvent,
} from '../api/search-history-api';

const searchHistoryKey = ['search-history'] as const;

export function useSearchHistory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: searchHistoryKey,
    queryFn: () => getSearchHistory(),
    enabled: !!user,
  });

  const clearMutation = useMutation({
    mutationFn: clearSearchHistory,
    onSuccess: () => {
      queryClient.setQueryData<string[]>(searchHistoryKey, []);
    },
  });

  const logSearch = (q: string) => {
    if (!user) return;

    logSearchEvent(q).catch(() => {});

    queryClient.setQueryData<string[]>(searchHistoryKey, (current) => {
      const next = (current ?? []).filter(
        (item) => item.toLowerCase() !== q.toLowerCase(),
      );
      return [q, ...next].slice(0, 10);
    });
  };

  return {
    history: query.data ?? [],
    isLoading: query.isLoading,
    clearHistory: clearMutation.mutate,
    isClearing: clearMutation.isPending,
    logSearch,
  };
}
