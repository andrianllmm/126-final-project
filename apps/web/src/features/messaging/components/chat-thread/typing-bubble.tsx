import { cva } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { TypingIndicator } from '@/shared/components/typing-indicator';

const bubbleVariants = cva('max-w-[min(32rem,85%)] rounded-2xl px-3 py-2', {
  variants: {
    variant: {
      own: 'rounded-br-sm bg-primary text-primary-foreground',
      other: 'rounded-bl-sm border bg-background text-foreground',
    },
  },
  defaultVariants: {
    variant: 'other',
  },
});

const containerVariants = cva('flex items-end gap-2', {
  variants: {
    variant: {
      own: 'justify-end',
      other: 'justify-start',
    },
  },
  defaultVariants: {
    variant: 'other',
  },
});

type Props = {
  side?: 'own' | 'other';
  className?: string;
};

export function TypingBubble({ side = 'other', className }: Props) {
  return (
    <div className={cn(containerVariants({ variant: side }), className)}>
      <div className={bubbleVariants({ variant: side })}>
        <TypingIndicator className="text-muted-foreground" />
      </div>
    </div>
  );
}
