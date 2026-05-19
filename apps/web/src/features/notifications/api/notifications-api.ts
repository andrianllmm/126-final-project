import { apiClient } from '@/shared/lib/api-client';
import type { Notification, NotificationList } from '@repo/api';

export const getNotifications = (read?: boolean) =>
  apiClient.get<NotificationList>('/notifications', {
    params: read === undefined ? undefined : { read },
  });

export const getUnreadNotifications = () =>
  apiClient.get<NotificationList>('/notifications/unread');

export const getUnreadNotificationCount = () =>
  apiClient.get<number>('/notifications/count');

export const markNotificationAsRead = (id: string) =>
  apiClient.patch<Notification>(`/notifications/${id}/read`, {});

export const markAllNotificationsAsRead = () =>
  apiClient.patch<NotificationList>('/notifications/read-all', {});
