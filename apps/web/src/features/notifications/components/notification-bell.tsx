'use client';

import { BellIcon } from 'lucide-react';

import { authClient } from '@/shared/lib/auth-client';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { NotificationList } from './notification-list';
import { useNotifications } from '../hooks/use-notifications';

export function NotificationBell() {
  const session = authClient.useSession();
  const { notifications, unreadCount, markAllAsRead, isMarkingAllAsRead } =
    useNotifications();

  if (session.isPending) {
    return <Skeleton className="h-9 w-9 rounded-md" />;
  }

  if (!session.data?.user) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon />
          {unreadCount > 0 ? (
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-[10px]">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-88">
        <NotificationList
          notifications={notifications}
          onMarkAllAsRead={() => markAllAsRead()}
          isMarkingAllAsRead={isMarkingAllAsRead}
        />
      </PopoverContent>
    </Popover>
  );
}
