import { Button } from '@/shared/components/ui/button';
import { Check, X, CheckCircle, Ban } from 'lucide-react';

import type { Transaction, TransactionAction } from '@repo/api';

interface TransactionActionsProps {
  transaction: Transaction;
  userRole: 'buyer' | 'seller';
  onAction: (action: TransactionAction) => void;
  variant?: 'default' | 'compact';
  showHeader?: boolean;
}

export function TransactionActions({
  transaction,
  userRole,
  onAction,
  variant = 'default',
  showHeader = false,
}: TransactionActionsProps) {
  const { status } = transaction;
  const isCompact = variant === 'compact';

  const content = (() => {
    // Seller actions for PENDING
    if (userRole === 'seller' && status === 'PENDING') {
      return (
        <div className="flex gap-2">
          <Button
            size={isCompact ? 'sm' : 'default'}
            onClick={() => onAction('accept')}
            className="gap-2"
          >
            <Check className="size-4" />
            {!isCompact && 'Accept'}
          </Button>
          <Button
            size={isCompact ? 'sm' : 'default'}
            variant="outline"
            onClick={() => onAction('reject')}
            className="gap-2"
          >
            <X className="size-4" />
            {!isCompact && 'Reject'}
          </Button>
        </div>
      );
    }

    // Seller actions for ACCEPTED
    if (userRole === 'seller' && status === 'ACCEPTED') {
      return (
        <div className="flex gap-2">
          <Button
            size={isCompact ? 'sm' : 'default'}
            onClick={() => onAction('complete')}
            className="gap-2"
          >
            <CheckCircle className="size-4" />
            {!isCompact && 'Mark Complete'}
          </Button>
          <Button
            size={isCompact ? 'sm' : 'default'}
            variant="destructive"
            onClick={() => onAction('cancel')}
            className="gap-2"
          >
            <Ban className="size-4" />
            {!isCompact && 'Cancel'}
          </Button>
        </div>
      );
    }

    // Buyer actions for PENDING
    if (userRole === 'buyer' && status === 'PENDING') {
      return (
        <Button
          size={isCompact ? 'sm' : 'default'}
          variant="outline"
          onClick={() => onAction('cancel')}
        >
          <X className="size-4" />
          {!isCompact && 'Cancel'}
        </Button>
      );
    }

    // Buyer actions for ACCEPTED
    if (userRole === 'buyer' && status === 'ACCEPTED') {
      return (
        <Button
          size={isCompact ? 'sm' : 'default'}
          variant="destructive"
          onClick={() => onAction('cancel')}
        >
          <Ban className="size-4" />
          {!isCompact && 'Cancel'}
        </Button>
      );
    }

    return null;
  })();

  if (!content) return null;

  return (
    <div className="space-y-3">
      {showHeader && <h3 className="text-lg font-semibold">Actions</h3>}
      {content}
    </div>
  );
}
