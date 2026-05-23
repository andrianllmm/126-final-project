import { UserAvatar } from '@/features/users/components/user-avatar';
import type { Conversation } from '@repo/api';
import Link from 'next/link';

type Props = {
  conversation?: Conversation;
  currentUserId?: string;
};

export function ChatThreadHeader({ conversation, currentUserId }: Props) {
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
        <UserAvatar
          name={otherParticipant.name}
          src={otherParticipant.image}
          sizeClassName="size-10 border-2 border-primary"
        />
      </Link>
      <div className="flex flex-col min-w-0">
        <Link
          href={`/listings/${conversation.listingId}`}
          className="truncate text-sm font-semibold text-foreground hover:text-primary"
        >
          {conversation.listing.title}
        </Link>
        <Link
          href={`/profile/${otherParticipant.id}`}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          {otherParticipant.name ?? 'Conversation'}
        </Link>
      </div>
    </div>
  );
}
