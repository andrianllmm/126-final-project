'use client';

import { usePathname } from 'next/navigation';

import { authClient } from '@/shared/lib/auth-client';

import { useConversations } from '../../hooks/use-conversations';
import { ConversationListItem } from './conversation-list-item';
import { ConversationListItemSkeleton } from './conversation-list-item-skeleton';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

export function ConversationList() {
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();
  const { data, isLoading, error } = useConversations();

  const loading = isPending || isLoading;

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
        <div className="flex items-center gap-3">
          <Button size="icon-sm" variant="ghost" asChild>
            <Link href="/">
              <ArrowLeftIcon className="size-5" />
            </Link>
          </Button>
          <Link
            href="/messages"
            className="text-2xl font-semibold tracking-tight hover:text-primary"
          >
            Chat
          </Link>
        </div>

        <Badge variant="secondary" className="rounded-full aspect-square">
          {loading ? '' : (data?.length ?? 0)}
        </Badge>
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
                  userId={session?.user?.id ?? ''}
                  isActive={pathname === `/messages/${conversation.id}`}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
