import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Notification } from '@repo/api';
import { cn } from '@/shared/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function NotificationItem({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick?: (id: string) => void;
}) {
  const unread = !notification.isRead;
  const router = useRouter();

  const handleClick = useCallback(() => {
    try {
      onClick?.(notification.id);
    } catch (e) {
      // ignore
    }

    if (notification.actionLink) {
      router.push(notification.actionLink);
    }
  }, [onClick, notification.id, notification.actionLink, router]);

  return (
    <div
      role={notification.actionLink ? 'link' : 'button'}
      onClick={handleClick}
      className={cn(
        'rounded-xl p-3 transition-colors hover:bg-muted',
        'cursor-pointer',
      )}
    >
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
