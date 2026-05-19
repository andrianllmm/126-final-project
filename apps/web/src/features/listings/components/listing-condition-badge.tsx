import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

import { ListingCondition } from '@repo/api';

const listingConditionBadgeVariants = cva('border backdrop-blur-sm', {
  variants: {
    condition: {
      NEW: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400',
      LIKE_NEW:
        'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
      GOOD: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
      FAIR: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400',
      FOR_PARTS:
        'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
    },
  },
  defaultVariants: {
    condition: 'GOOD',
  },
});

interface ListingConditionBadgeProps
  extends
    React.ComponentProps<typeof Badge>,
    VariantProps<typeof listingConditionBadgeVariants> {
  condition: (typeof ListingCondition)[keyof typeof ListingCondition];
}

function formatCondition(condition?: string) {
  if (!condition) return '';

  return condition
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function ListingConditionBadge({
  condition,
  className,
  ...props
}: ListingConditionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(listingConditionBadgeVariants({ condition }), className)}
      {...props}
    >
      {formatCondition(condition)}
    </Badge>
  );
}
