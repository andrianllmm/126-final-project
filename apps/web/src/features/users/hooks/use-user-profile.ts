import { useQuery } from '@tanstack/react-query';
import {
  getMyLikedListings,
  getUserProfile,
  getUserProfileStats,
} from '../api/users-api';
import { useAuth } from '@/features/auth/hooks/use-auth';

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

export function useMyLikedListings(enabled = true) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['users', 'me', 'liked-listings'],
    queryFn: getMyLikedListings,
    enabled: Boolean(user?.id) && enabled,
  });
}
