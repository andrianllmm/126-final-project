'use client';

import { usePathname } from 'next/navigation';

import { useConversations } from '../../hooks/use-conversations';
import { ConversationListItem } from './conversation-list-item';
import { ConversationListItemSkeleton } from './conversation-list-item-skeleton';

import { Badge } from '@/shared/components/ui/badge';

export function ConversationList() {
  const pathname = usePathname();

  const { data, isLoading, error } = useConversations();

  if (isLoading) {
    return (
      <div className="space-y-3 px-4 py-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <ConversationListItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-4 text-sm text-muted-foreground">
        Failed to load conversations.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <h1 className="text-4xl font-semibold tracking-tight">Chat</h1>

        <Badge variant="secondary">{data?.length ?? 0}</Badge>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {data?.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isActive={pathname === `/messages/${conversation.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
