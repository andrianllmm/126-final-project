import { cn } from '@/shared/lib/utils';
import type { Transaction, TransactionAction } from '@repo/api';
import { Package } from 'lucide-react';
import { TransactionCard } from './transaction-card';

interface TransactionListProps {
  transactions: Transaction[];
  userRole: 'buyer' | 'seller';
  onAction: (transactionId: string, action: TransactionAction) => void;
  emptyMessage?: string;
  className?: string;
}

export function TransactionList({
  transactions,
  userRole,
  onAction,
  emptyMessage = 'No transactions yet',
  className,
}: TransactionListProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12',
          className,
        )}
      >
        <Package className="size-8 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.transactionId}
          transaction={transaction}
          userRole={userRole}
          onAction={
            onAction
              ? (action) => onAction(transaction.transactionId, action)
              : undefined
          }
        />
      ))}
    </div>
  );
}
