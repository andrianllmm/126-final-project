import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle2, Clock3 } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

import { ListingStatus } from '@repo/api';

const listingStatusBadgeVariants = cva('border capitalize', {
  variants: {
    status: {
      AVAILABLE:
        'bg-primary/10 text-primary border-primary/20 dark:text-primary',
      RESERVED:
        'bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400',
      SOLD: 'bg-muted text-muted-foreground border-border',
      DRAFT: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
      ARCHIVED: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20',
    },
  },
  defaultVariants: {
    status: 'AVAILABLE',
  },
});

interface ListingStatusBadgeProps
  extends
    React.ComponentProps<typeof Badge>,
    VariantProps<typeof listingStatusBadgeVariants> {
  status: (typeof ListingStatus)[keyof typeof ListingStatus];
}

function formatStatus(status?: string) {
  if (!status) return '';
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function ListingStatusBadge({
  status,
  className,
  ...props
}: ListingStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(listingStatusBadgeVariants({ status }), className)}
      {...props}
    >
      {status === 'SOLD' && <CheckCircle2 className="mr-1 h-3 w-3" />}
      {status === 'RESERVED' && <Clock3 className="mr-1 h-3 w-3" />}
      {formatStatus(status)}
    </Badge>
  );
}
