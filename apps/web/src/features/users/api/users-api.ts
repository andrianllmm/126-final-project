import { apiClient } from '@/shared/lib/api-client';
import { UserProfile, UserProfileStats } from '@repo/api';

export const getUserProfile = (userId: string) =>
  apiClient.get<UserProfile>(`/users/${userId}/profile`);

export const getUserProfileStats = (userId: string) =>
  apiClient.get<UserProfileStats>(`/users/${userId}/stats`);
