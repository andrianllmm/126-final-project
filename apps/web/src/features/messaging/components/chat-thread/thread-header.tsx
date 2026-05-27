import Link from 'next/link';
import { ListingStatusBadge } from '@/features/listings/components/listing-status-badge';
import { UserAvatar } from '@/features/users/components/user-avatar';
import { cn } from '@/shared/lib/utils';
import type { Conversation } from '@repo/api';

type Props = {
  conversation?: Conversation;
  currentUserId?: string;
  isConnected?: boolean;
};

export function ChatThreadHeader({
  conversation,
  currentUserId,
  isConnected,
}: Props) {
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
    <div className="flex items-center gap-2 min-w-0">
      <Link href={`/profile/${otherParticipant.id}`}>
        <div className="relative inline-block">
          <UserAvatar
            name={otherParticipant.name}
            src={otherParticipant.image}
            sizeClassName="size-10 border-2 border-primary"
          />

          <span
            className={cn(
              'absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background',
              isConnected ? 'bg-primary' : 'bg-muted-foreground',
            )}
          />
        </div>
      </Link>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/listings/${conversation.listingId}`}
            className="truncate text-sm font-semibold text-foreground hover:text-primary"
          >
            {conversation.listing.title}
          </Link>
          {conversation.listing.status && (
            <ListingStatusBadge status={conversation.listing.status} />
          )}
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={`/profile/${otherParticipant.id}`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {otherParticipant.name ?? 'Conversation'}
          </Link>
        </div>
      </div>
    </div>
  );
}
