'use client';

import Link from 'next/link';
import { cva } from 'class-variance-authority';
import { MoreHorizontal } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';

import { Conversation } from '@repo/api';
import { UserAvatar } from '@/features/users/components/user-avatar';
import { cn } from '@/shared/lib/utils';

import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useMarkConversationAsRead } from '../../hooks/use-conversations';

const itemVariants = cva(
  'group relative flex items-stretch gap-3 rounded-2xl px-3 py-2 transition-colors hover:bg-muted/60',
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

type Participant = Conversation['seller'] | Conversation['buyer'];

type Props = {
  conversation: Conversation;
  userId: string;
  isActive?: boolean;
};

export function ConversationListItem({
  conversation,
  userId,
  isActive = false,
}: Props) {
  const participant =
    userId == conversation.sellerId ? conversation.buyer : conversation.seller;

  const preview = conversation.messages?.[0]?.content ?? 'No messages yet';

  const isUnread = conversation.messages?.some((m) => !m.isRead) ?? false;

  return (
    <div className={cn(itemVariants({ active: isActive }), 'items-center')}>
      <ConversationContent
        conversation={conversation}
        participant={participant}
        preview={preview}
        isUnread={isUnread}
      />

      <ConversationActions conversation={conversation} />
    </div>
  );
}

function ConversationContent({
  conversation,
  participant,
  preview,
  isUnread,
}: {
  conversation: Conversation;
  participant: Participant;
  preview: string;
  isUnread: boolean;
}) {
  return (
    <Link
      href={`/messages/${conversation.id}`}
      className="flex flex-1 items-center gap-3 min-w-0"
    >
      <UserAvatar
        name={participant.name}
        src={participant.image}
        sizeClassName="size-14"
      />

      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                'truncate text-[14px] leading-none flex items-center gap-2',
                isUnread ? 'font-semibold text-foreground' : 'font-medium',
              )}
            >
              {conversation.listing.title}

              {isUnread && (
                <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
              )}
            </div>

            <div
              className={cn(
                'mt-1 truncate text-[12px]',
                isUnread
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {participant.name}
            </div>
          </div>
        </div>

        <div
          className={cn(
            'mt-1 flex items-center justify-start gap-2 text-[13px]',
            isUnread ? 'font-medium text-foreground' : 'text-muted-foreground',
          )}
        >
          <span className="truncate">{preview}</span>

          {conversation.lastMessageAt && (
            <>
              <span className="text-muted-foreground/60">•</span>
              <span>
                <span>
                  {formatDistanceToNowStrict(
                    new Date(conversation.lastMessageAt),
                    {
                      addSuffix: false,
                    },
                  )}
                </span>
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

function ConversationActions({ conversation }: { conversation: Conversation }) {
  const { mutate: markAsRead } = useMarkConversationAsRead();

  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 border-0 rounded-full"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/profile/${conversation.buyerId}`}>View profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => markAsRead(conversation.id)}>
            Mark as read
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
