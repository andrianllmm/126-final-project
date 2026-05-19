'use client';

import { CheckCheckIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import type { Notification } from '@repo/api';

import { NotificationItem } from './notification-item';

export function NotificationList({
  notifications,
  onMarkAllAsRead,
  isMarkingAllAsRead,
}: {
  notifications: Notification[];
  onMarkAllAsRead?: () => void;
  isMarkingAllAsRead?: boolean;
}) {
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="flex max-h-96 flex-col gap-3">
      {/* header */}
      <div className="flex items-center justify-between gap-3 px-3">
        <div className="flex items-center gap-2">
          {hasUnread && <span className="h-2 w-2 rounded-full bg-primary" />}
          <p className="text-lg font-semibold leading-none">Notifications</p>
        </div>

        {onMarkAllAsRead && (
          <Button
            type="button"
            size="xs"
            variant="ghost"
            className="text-xs"
            onClick={onMarkAllAsRead}
            disabled={!hasUnread || isMarkingAllAsRead}
          >
            <CheckCheckIcon className="size-4" />
            Mark all read
          </Button>
        )}
      </div>

      <Separator />

      {/* content */}
      <div className="min-h-0 overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
