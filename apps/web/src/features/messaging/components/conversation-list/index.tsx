'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftIcon, ExpandIcon } from 'lucide-react';

import { useAuth } from '@/features/auth/hooks/use-auth';

import { useConversations } from '../../hooks/use-conversations';
import { ConversationListItem } from './conversation-list-item';
import { ConversationListItemSkeleton } from './conversation-list-item-skeleton';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

type ConversationListProps = {
  mode?: 'default' | 'popover';
};

export function ConversationList({ mode = 'default' }: ConversationListProps) {
  const pathname = usePathname();

  const { user, isPending } = useAuth();
  const { data, isLoading, error } = useConversations();

  const loading = isPending || isLoading;

  const isPopover = mode === 'popover';

  if (error) {
    return (
      <div className="px-4 py-4 text-sm text-muted-foreground">
        Failed to load conversations.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div
        className={[
          'flex items-center justify-between gap-3',
          isPopover ? 'px-3 py-3' : 'px-4 py-4',
        ].join(' ')}
      >
        <div className="flex items-center gap-3">
          {!isPopover && (
            <Button size="icon-sm" variant="ghost" asChild>
              <Link href="/">
                <ArrowLeftIcon className="size-5" />
              </Link>
            </Button>
          )}

          <div className="flex items-center gap-2">
            <Link
              href="/messages"
              className={[
                'font-semibold tracking-tight hover:text-primary transition-colors',
                isPopover ? 'text-base' : 'text-2xl',
              ].join(' ')}
            >
              Chats
            </Link>

            <Badge variant="secondary" className="rounded-full aspect-square">
              {loading ? '' : (data?.length ?? 0)}
            </Badge>
          </div>
        </div>

        {isPopover && (
          <Button size="icon-sm" variant="ghost" asChild>
            <Link href="/messages">
              <ExpandIcon className="size-4" />
            </Link>
          </Button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <ConversationListItemSkeleton key={index} />
              ))
            : data?.map((conversation) => (
                <ConversationListItem
                  key={conversation.id}
                  conversation={conversation}
                  userId={user?.id ?? ''}
                  isActive={pathname === `/messages/${conversation.id}`}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
