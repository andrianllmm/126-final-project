'use client';

import Link from 'next/link';
import { cva } from 'class-variance-authority';
import { MoreHorizontal } from 'lucide-react';

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

type Props = {
  conversation: Conversation;
  isActive?: boolean;
};

export function ConversationListItem({
  conversation,
  isActive = false,
}: Props) {
  const participantName =
    conversation.buyer.name ?? conversation.seller.name ?? 'Conversation';

  const preview = conversation.messages?.[0]?.content ?? 'No messages yet';

  const isUnread = conversation.messages?.some((m) => !m.isRead) ?? false;

  return (
    <div className={cn(itemVariants({ active: isActive }), 'items-center')}>
      <ConversationContent
        conversation={conversation}
        participantName={participantName}
        preview={preview}
        isUnread={isUnread}
      />

      <ConversationActions conversation={conversation} />
    </div>
  );
}

function ConversationContent({
  conversation,
  participantName,
  preview,
  isUnread,
}: {
  conversation: Conversation;
  participantName: string;
  preview: string;
  isUnread: boolean;
}) {
  return (
    <Link
      href={`/messages/${conversation.id}`}
      className="flex flex-1 items-center gap-3 min-w-0"
    >
      <UserAvatar
        name={conversation.buyer.name}
        src={conversation.buyer.avatarUpload?.url}
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

        <div
          className={cn(
            'mt-1 truncate text-[13px]',
            isUnread ? 'font-medium text-foreground' : 'text-muted-foreground',
          )}
        >
          {preview}
        </div>
      </div>
    </Link>
  );
}

function ConversationActions({ conversation }: { conversation: Conversation }) {
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
