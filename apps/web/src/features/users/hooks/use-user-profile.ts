import { useQuery } from '@tanstack/react-query';
import { getUserProfile, getUserProfileStats } from '../api/users-api';

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['users', 'profile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: Boolean(userId),
  });
}

export function useUserProfileStats(userId: string) {
  return useQuery({
    queryKey: ['users', 'stats', userId],
    queryFn: () => getUserProfileStats(userId),
    enabled: Boolean(userId),
  });
}
