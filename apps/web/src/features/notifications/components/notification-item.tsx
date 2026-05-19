'use client';

import type { Notification } from '@repo/api';
import { cn } from '@/shared/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  const unread = !notification.isRead;

  return (
    <div className="rounded-xl p-3 transition-colors hover:bg-muted">
      <div className="flex gap-3">
        {unread && (
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
        )}

        <div className="min-w-0 flex-1">
          {/* header */}
          <div className="flex items-start justify-between gap-3">
            <p
              className={cn(
                'text-sm leading-none truncate',
                unread ? 'font-semibold' : 'font-medium',
              )}
            >
              {notification.title}
            </p>

            <span className="shrink-0 text-[11px] text-muted-foreground">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* content */}
          <p className="mt-1 text-sm leading-snug text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
}
