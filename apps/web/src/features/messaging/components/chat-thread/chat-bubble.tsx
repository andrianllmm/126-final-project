import type { Message } from '@repo/api';
import { cva } from 'class-variance-authority';
import { Check, CheckCheck } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { UserAvatar } from '@/features/users/components/user-avatar';

type Props = {
  message: Message;
  isOwn?: boolean;
};

const bubbleVariants = cva('max-w-[32rem] rounded-2xl px-3 py-2 text-sm', {
  variants: {
    variant: {
      own: 'rounded-br-sm bg-primary text-primary-foreground text-end',
      other: 'rounded-bl-sm border bg-background text-foreground text-start',
    },
  },
});

export function ChatBubble({ message, isOwn = false }: Props) {
  const variant = isOwn ? 'own' : 'other';

  const time = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(message.createdAt));

  const renderReceipt = () => {
    if (!isOwn) return null;

    if (message.isRead) {
      return <CheckCheck className="size-3 text-muted-foreground/70" />;
    }

    return <Check className="size-3 text-muted-foreground/30" />;
  };

  return (
    <div className={cn('flex items-end gap-2', isOwn ? 'justify-end' : '')}>
      {/* Avatar */}
      {!isOwn && (
        <UserAvatar name={message.sender.name} src={message.sender.image} />
      )}

      <div
        className={cn(
          'flex flex-col justify-center gap-1',
          isOwn ? 'items-end' : 'items-start',
        )}
      >
        {/* Content */}
        <div
          className={cn(
            'whitespace-pre-wrap leading-relaxed',
            bubbleVariants({ variant }),
          )}
        >
          {message.content}
        </div>

        {/* Metadata */}
        <div
          className={cn(
            'flex items-center gap-1 text-xs text-muted-foreground',
            isOwn ? 'justify-end' : 'justify-start',
          )}
        >
          {renderReceipt()}

          <div>{time}</div>
        </div>
      </div>
    </div>
  );
}
