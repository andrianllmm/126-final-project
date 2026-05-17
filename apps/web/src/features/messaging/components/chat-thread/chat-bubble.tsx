import type { Message } from '@repo/api';
import { cva } from 'class-variance-authority';
import { Check, CheckCheck } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';

type Props = {
  message: Message;
  isOwn?: boolean;
};

const bubbleVariants = cva(
  'max-w-[min(32rem,85%)] rounded-2xl px-3 py-2 text-sm',
  {
    variants: {
      variant: {
        own: 'rounded-br-sm bg-primary text-primary-foreground',
        other: 'rounded-bl-sm border bg-background text-foreground',
      },
    },
  },
);

const timeVariants = cva('text-xs', {
  variants: {
    variant: {
      own: 'text-primary-foreground/70',
      other: 'text-muted-foreground',
    },
  },
});

const containerVariants = cva('flex items-end gap-2', {
  variants: {
    variant: {
      own: 'justify-end',
      other: '',
    },
  },
});

export function ChatBubble({ message, isOwn = false }: Props) {
  const variant = isOwn ? 'own' : 'other';

  const time = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(message.createdAt));

  const initials = message.sender.name?.slice(0, 1).toUpperCase() ?? 'U';

  const avatar = (
    <Avatar size="sm" className="mt-1">
      <AvatarImage src={message.sender.avatarUpload?.url ?? undefined} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );

  const renderReceipt = () => {
    if (!isOwn) return null;

    if (message.isRead) {
      return <CheckCheck className="size-3 text-primary-foreground/70" />;
    }

    return <Check className="size-3 text-primary-foreground/30" />;
  };

  return (
    <div className={containerVariants({ variant })}>
      {!isOwn && avatar}

      <div className={bubbleVariants({ variant })}>
        <div className="whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>

        <div
          className={cn(
            'mt-1 flex items-center gap-1',
            isOwn ? 'justify-end' : 'justify',
          )}
        >
          {renderReceipt()}

          <div className={timeVariants({ variant })}>{time}</div>
        </div>
      </div>
    </div>
  );
}
