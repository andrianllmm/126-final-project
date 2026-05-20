import { cn } from '@/shared/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { Transaction, TransactionStatus } from '@repo/api';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert';
import {
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  Info,
  LucideIcon,
} from 'lucide-react';

type UserRole = 'buyer' | 'seller';

const alertVariants = cva('flex items-start gap-2', {
  variants: {
    status: {
      PENDING:
        'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-200 dark:border-yellow-900',
      ACCEPTED:
        'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-900',
      REJECTED:
        'bg-red-50 text-red-900 border-red-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-900',
      COMPLETED:
        'bg-green-50 text-green-900 border-green-200 dark:bg-green-950/40 dark:text-green-200 dark:border-green-900',
      CANCELLED:
        'bg-gray-50 text-gray-900 border-gray-200 dark:bg-gray-900/40 dark:text-gray-200 dark:border-gray-800',
    },
  },
  defaultVariants: {
    status: 'PENDING',
  },
});

type MessageConfig = {
  icon: LucideIcon;
  title: string;
  description: (ctx: {
    transaction: Transaction;
    counterpartyName: string;
  }) => string;
};

const messageConfig: Record<
  UserRole,
  Record<TransactionStatus, MessageConfig>
> = {
  buyer: {
    PENDING: {
      icon: Clock,
      title: 'Request Sent',
      description: ({ counterpartyName }) =>
        `Waiting for ${counterpartyName} to respond to your request. You can message them while you wait.`,
    },
    ACCEPTED: {
      icon: CheckCircle,
      title: 'Request Accepted',
      description: ({ counterpartyName }) =>
        `${counterpartyName} accepted your request! Coordinate meetup details via chat.`,
    },
    REJECTED: {
      icon: XCircle,
      title: 'Request Declined',
      description: ({ counterpartyName }) =>
        `${counterpartyName} declined your request. You can browse similar items or search for alternatives.`,
    },
    COMPLETED: {
      icon: CheckCircle,
      title: 'Transaction Complete',
      description: () =>
        'This transaction has been completed. Please rate your experience.',
    },
    CANCELLED: {
      icon: Ban,
      title: 'Transaction Cancelled',
      description: () => 'This transaction has been cancelled.',
    },
  },

  seller: {
    PENDING: {
      icon: Info,
      title: 'New Purchase Request',
      description: ({ counterpartyName }) =>
        `${counterpartyName} wants to buy this item. Review their profile and accept or reject the request.`,
    },
    ACCEPTED: {
      icon: CheckCircle,
      title: 'Request Accepted',
      description: ({ counterpartyName }) =>
        `You accepted ${counterpartyName}'s request. Coordinate meetup details via chat.`,
    },
    REJECTED: {
      icon: XCircle,
      title: 'Request Declined',
      description: () =>
        'You declined this request. Your item is still available for other buyers.',
    },
    COMPLETED: {
      icon: CheckCircle,
      title: 'Transaction Complete',
      description: () =>
        'This transaction has been completed. Please rate your experience.',
    },
    CANCELLED: {
      icon: Ban,
      title: 'Transaction Cancelled',
      description: () => 'This transaction has been cancelled.',
    },
  },
};

interface TransactionStatusMessageProps {
  transaction: Transaction;
  userRole: UserRole;
  className?: string;
}

export function TransactionStatusMessage({
  transaction,
  userRole,
  className,
}: TransactionStatusMessageProps) {
  const { status } = transaction;

  const counterparty =
    userRole === 'buyer' ? transaction.seller : transaction.buyer;

  const { icon: Icon, title, description } = messageConfig[userRole][status];

  return (
    <Alert className={cn(alertVariants({ status }), className)}>
      <Icon className="h-4 w-4" />
      <div className="flex flex-col gap-1">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          {description({
            transaction,
            counterpartyName: counterparty.name,
          })}
        </AlertDescription>
      </div>
    </Alert>
  );
}
