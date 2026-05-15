import { apiClient } from '@/shared/lib/api-client';
import {
  type UserProfile,
  type UserProfileStats,
  type UserProfileUpdateInput,
} from '@repo/api';

export const getUserProfile = (userId: string) =>
  apiClient.get<UserProfile>(`/users/${userId}/profile`);

export const getUserProfileStats = (userId: string) =>
  apiClient.get<UserProfileStats>(`/users/${userId}/stats`);

export const updateUserProfile = (profile: UserProfileUpdateInput) =>
  apiClient.patch<UserProfile, UserProfileUpdateInput>(
    '/users/me/profile',
    profile,
  );
