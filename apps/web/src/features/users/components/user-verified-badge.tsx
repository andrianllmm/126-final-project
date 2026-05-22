import { cn } from '@/shared/lib/utils';
import { BadgeCheckIcon } from 'lucide-react';

type VerifiedBadgeProps = {
  className?: string;
};

export function VerifiedBadge({ className }: VerifiedBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-primary p-0.75',
        className,
      )}
    >
      <BadgeCheckIcon className="size-4 text-primary-foreground" />
    </span>
  );
}
