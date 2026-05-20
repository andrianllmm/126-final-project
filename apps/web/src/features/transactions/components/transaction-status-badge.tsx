import { cn } from '@/shared/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { TransactionStatus } from '@repo/api';
import { Badge } from '@/shared/components/ui/badge';

const statusBadgeVariants = cva(
  'font-medium px-2 py-1 flex items-center gap-1',
  {
    variants: {
      status: {
        PENDING:
          'bg-yellow-50 text-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-200',
        ACCEPTED:
          'bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200',
        REJECTED: 'bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200',
        COMPLETED:
          'bg-green-50 text-green-900 dark:bg-green-950/40 dark:text-green-200',
        CANCELLED:
          'bg-gray-50 text-gray-900 dark:bg-gray-900/40 dark:text-gray-200',
      },
    },
    defaultVariants: {
      status: 'PENDING',
    },
  },
);

interface TransactionStatusBadgeProps extends VariantProps<
  typeof statusBadgeVariants
> {
  status: TransactionStatus;
  className?: string;
}

const statusLabels: Record<TransactionStatus, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const statusDot: Record<TransactionStatus, string> = {
  PENDING: 'bg-yellow-500',
  ACCEPTED: 'bg-blue-500',
  REJECTED: 'bg-red-500',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-gray-500',
};

export function TransactionStatusBadge({
  status,
  className,
}: TransactionStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(statusBadgeVariants({ status }), className)}
    >
      <span className={cn('size-2 rounded-full', statusDot[status])} />
      {statusLabels[status]}
    </Badge>
  );
}
