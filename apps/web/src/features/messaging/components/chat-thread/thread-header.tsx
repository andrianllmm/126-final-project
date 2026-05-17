import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { Conversation } from '@repo/api';

type Props = {
  conversation?: Conversation;
  isLoading?: boolean;
  currentUserId?: string;
};

export function ChatThreadHeader({
  conversation,
  isLoading,
  currentUserId,
}: Props) {
  if (isLoading && !conversation) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-3 w-56" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div>
        <div className="text-sm font-medium text-foreground">Messages</div>
        <div className="text-sm text-muted-foreground">
          Select a conversation to start chatting.
        </div>
      </div>
    );
  }

  const otherParticipant =
    conversation.buyerId === currentUserId
      ? conversation.seller
      : conversation.buyer;

  return (
    <div className="min-w-0 space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="truncate text-sm font-medium text-foreground">
          {conversation.listing.title}
        </h2>
        <Badge variant="outline" className="shrink-0">
          {conversation.listing.status ?? 'Active conversation'}
        </Badge>
      </div>
      <div className="text-sm text-muted-foreground">
        {otherParticipant.name ?? 'Conversation'}
      </div>
    </div>
  );
}
