import * as React from 'react';
import { cn } from '@/shared/lib/utils';

type TypingIndicatorProps = {
  className?: string;
  dotClassName?: string;
};

export function TypingIndicator({
  className,
  dotClassName,
}: TypingIndicatorProps) {
  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="status"
      aria-label="Typing indicator"
    >
      <Dot delay={0} className={dotClassName} />
      <Dot delay={150} className={dotClassName} />
      <Dot delay={300} className={dotClassName} />
    </div>
  );
}

function Dot({ delay, className }: { delay: number; className?: string }) {
  return (
    <span
      className={cn(
        'h-2 w-2 rounded-full bg-current animate-bounce',
        className,
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: '1s',
      }}
    />
  );
}
