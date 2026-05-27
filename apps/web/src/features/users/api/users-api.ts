import { apiClient } from '@/shared/lib/api-client';
import {
  type ListingList,
  type UserProfile,
  type UserProfileUpdateInput,
  type UserProfileStats,
} from '@repo/api';

export const getUserProfile = (userId: string) =>
  apiClient.get<UserProfile>(`/users/${userId}/profile`);

export const getUserProfileStats = (userId: string) =>
  apiClient.get<UserProfileStats>(`/users/${userId}/stats`);

export const getMyLikedListings = () =>
  apiClient.get<ListingList>('/users/me/liked-listings');

export const updateUserProfile = (input: UserProfileUpdateInput) =>
  apiClient.patch<UserProfile, UserProfileUpdateInput>(
    '/users/me/profile',
    input,
  );

export const uploadUserAvatar = (file: File) => {
  const form = new FormData();
  form.append('avatar', file);

  return apiClient.post<UserProfile, FormData>('/users/me/avatar', form);
};

export const removeUserAvatar = () =>
  apiClient.delete<UserProfile>('/users/me/avatar');
