'use client';

import Link from 'next/link';
import { cva } from 'class-variance-authority';

import { Conversation } from '@repo/api';
import { UserAvatar } from '@/features/users/components/user-avatar';
import { cn } from '@/shared/lib/utils';

type Props = {
  conversation: Conversation;
  isActive?: boolean;
};

const itemVariants = cva(
  'flex items-stretch gap-3 rounded-2xl px-3 py-2 transition-colors hover:bg-muted/60',
  {
    variants: {
      active: {
        true: 'bg-primary/5 dark:bg-primary/10',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export function ConversationListItem({
  conversation,
  isActive = false,
}: Props) {
  const participantName =
    conversation.buyer.name ?? conversation.seller.name ?? 'Conversation';

  const preview = conversation.messages?.[0]?.content ?? 'No messages yet';

  return (
    <Link href={`/messages/${conversation.id}`}>
      <div
        className={cn(
          itemVariants({ active: isActive }),
          'flex items-center gap-3',
        )}
      >
        <UserAvatar
          name={conversation.buyer.name}
          src={conversation.buyer.avatarUpload?.url}
          sizeClassName="size-14"
        />

        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-start gap-1">
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-medium leading-none text-foreground">
                {conversation.listing.title}
              </div>

              <div className="mt-1 truncate text-[12px] text-muted-foreground">
                {participantName}
              </div>
            </div>

            {conversation.lastMessageAt && (
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {new Intl.DateTimeFormat('en', {
                  month: 'short',
                  day: 'numeric',
                }).format(new Date(conversation.lastMessageAt))}
              </span>
            )}
          </div>

          <div className="mt-1 truncate text-[13px] text-muted-foreground">
            {preview}
          </div>
        </div>
      </div>
    </Link>
  );
}
