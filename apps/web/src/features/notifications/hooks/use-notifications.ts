'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { initializeSocket } from '@/shared/lib/socket-client';
import type { Notification } from '@repo/api';

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../api/notifications-api';

const notificationsKey = ['notifications'] as const;
const notificationCountKey = ['notifications', 'count'] as const;

function upsertNotificationList(
  currentNotifications: Notification[] | undefined,
  notification: Notification,
) {
  const notifications = currentNotifications ? [...currentNotifications] : [];
  const existingIndex = notifications.findIndex(
    (item) => item.id === notification.id,
  );

  if (existingIndex === -1) {
    return [notification, ...notifications];
  }

  notifications[existingIndex] = notification;
  return notifications;
}

export function useNotifications() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;
  const [isConnected, setIsConnected] = useState(false);

  const notificationsQuery = useQuery({
    queryKey: notificationsKey,
    queryFn: () => getNotifications(),
    enabled: !!userId,
  });

  const unreadCountQuery = useQuery({
    queryKey: notificationCountKey,
    queryFn: getUnreadNotificationCount,
    enabled: !!userId,
  });

  const markNotificationAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: async (notification) => {
      const currentNotifications =
        queryClient.getQueryData<Notification[]>(notificationsKey);
      const existingNotification = currentNotifications?.find(
        (item) => item.id === notification.id,
      );

      queryClient.setQueryData<Notification[]>(notificationsKey, (current) =>
        upsertNotificationList(current, notification),
      );

      queryClient.setQueryData<number>(notificationCountKey, (current) => {
        if (current === undefined) return current;

        const numeric = Number(current ?? 0);

        if (existingNotification && !existingNotification.isRead) {
          return Math.max(numeric - 1, 0);
        }

        return numeric;
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: async (notifications) => {
      queryClient.setQueryData<Notification[]>(notificationsKey, (current) => {
        const currentNotifications = current ?? [];
        const next = [...currentNotifications];

        for (const notification of notifications) {
          const existingIndex = next.findIndex(
            (item) => item.id === notification.id,
          );

          if (existingIndex === -1) {
            next.unshift(notification);
            continue;
          }

          next[existingIndex] = notification;
        }

        return next;
      });

      queryClient.setQueryData<number>(notificationCountKey, 0);
    },
  });

  useEffect(() => {
    if (!userId) return;

    const socket = initializeSocket('/notifications');

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const applyReadNotification = (notification: Notification) => {
      const currentNotifications =
        queryClient.getQueryData<Notification[]>(notificationsKey);
      const existingNotification = currentNotifications?.find(
        (item) => item.id === notification.id,
      );

      queryClient.setQueryData<Notification[]>(notificationsKey, (current) =>
        upsertNotificationList(current, notification),
      );

      queryClient.setQueryData<number>(notificationCountKey, (current) => {
        if (current === undefined) return current;

        const numeric = Number(current ?? 0);

        if (
          existingNotification &&
          !existingNotification.isRead &&
          notification.isRead
        ) {
          return Math.max(numeric - 1, 0);
        }

        return numeric;
      });
    };

    const handleNewNotification = (notification: Notification) => {
      queryClient.setQueryData<Notification[]>(notificationsKey, (current) =>
        upsertNotificationList(current, notification),
      );

      queryClient.setQueryData<number>(notificationCountKey, (current) => {
        const numeric = Number(current ?? 0);
        return numeric === 0 && current === undefined
          ? 1
          : numeric + (notification.isRead ? 0 : 1);
      });

      toast(notification.title, {
        description: notification.message,
      });
    };

    const handleNotificationRead = (notification: Notification) => {
      applyReadNotification(notification);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('notification:new', handleNewNotification);
    socket.on('notification:read', handleNotificationRead);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('notification:new', handleNewNotification);
      socket.off('notification:read', handleNotificationRead);
    };
  }, [queryClient, userId]);

  const notifications = notificationsQuery.data ?? [];
  const unreadCount = Number(unreadCountQuery.data ?? 0);

  return {
    notifications,
    unreadCount,
    isConnected,
    isLoading: notificationsQuery.isLoading || unreadCountQuery.isLoading,
    markNotificationAsRead: markNotificationAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isMarkingAsRead: markNotificationAsReadMutation.isPending,
  };
}
