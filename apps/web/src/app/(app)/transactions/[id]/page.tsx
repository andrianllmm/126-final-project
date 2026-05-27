'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { format } from 'date-fns';
import { currencyFormatter } from '@/shared/lib/currency-formatter';

import { useSession } from '@/features/auth/hooks/use-session';
import { useTransaction } from '@/features/transactions/hooks/use-transaction';
import { useUpdateTransactionStatus } from '@/features/transactions/hooks/use-update-transaction-status';

import { TransactionStatusMessage } from '@/features/transactions/components/transaction-status-message';
import { TransactionActions } from '@/features/transactions/components/transaction-actions';
import { TransactionActionDialog } from '@/features/transactions/components/transaction-action-dialog';
import { ListingCardCompact } from '@/features/transactions/components/listing-card-compact';
import { UserCardCompact } from '@/features/users/components/user-card-compact';

import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Spinner } from '@/shared/components/ui/spinner';
import { ArrowLeft } from 'lucide-react';
import {
  TransactionAction,
  TransactionStatus,
  type Transaction,
} from '@repo/api';
import { toast } from 'sonner';
import { CopyText } from '@/shared/components/copy-text';
import { MessageButton } from '@/features/messaging/components/message-button';
import { TransactionOffersPanel } from '@/features/transactions/components/transaction-offers-panel';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();

  const transactionId = params.id as string;

  const { data: session } = useSession();
  const user = session?.user ?? null;

  const { data: transaction, isLoading } = useTransaction(transactionId);

  const updateStatus = useUpdateTransactionStatus();

  const [dialog, setDialog] = useState<{
    open: boolean;
    action: TransactionAction | null;
    transaction: Transaction | null;
  }>({
    open: false,
    action: null,
    transaction: null,
  });

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-8 flex items-center justify-center min-h-100">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Transaction not found</p>
          <Button onClick={() => router.push('/transactions')}>Back</Button>
        </div>
      </div>
    );
  }

  const userRole = transaction.buyerId === user.id ? 'buyer' : 'seller';

  const counterparty =
    userRole === 'buyer' ? transaction.seller : transaction.buyer;

  const handleAction = (action: TransactionAction) => {
    setDialog({
      open: true,
      action,
      transaction,
    });
  };

  const handleConfirm = (reason?: string) => {
    if (!dialog.action) return;

    updateStatus.mutate(
      {
        id: transaction.transactionId,
        action: dialog.action,
        ...(dialog.action === 'cancel' ? { reason } : {}),
      },
      {
        onSuccess: () => {
          toast.success('Transaction updated');
          setDialog({ open: false, action: null, transaction: null });
        },
        onError: () => {
          toast.error('Failed to update transaction');
        },
      },
    );
  };

  return (
    <>
      <div className="container max-w-6xl py-8 space-y-8">
        <Button
          variant="ghost"
          className="mb-2"
          onClick={() => router.push('/transactions')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* MAIN + SIDEBAR LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-semibold">Transaction Details</h1>
                  <CopyText
                    value={transaction.transactionId}
                    className="text-sm text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Created {format(new Date(transaction.createdAt), 'PPp')}
                  </p>
                </div>

                <MessageButton
                  listingId={transaction.listingId}
                  buyerId={
                    userRole === 'seller' ? transaction.buyerId : undefined
                  }
                  disabled={transaction.status === TransactionStatus.COMPLETED}
                >
                  Message
                </MessageButton>
              </div>
            </div>

            <TransactionStatusMessage
              transaction={transaction}
              userRole={userRole}
            />

            <Separator />

            <section className="space-y-6">
              <h3 className="text-lg font-semibold">Agreement</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Agreed Price</p>
                  <p className="text-xl font-bold text-primary">
                    {currencyFormatter.format(transaction.agreedPrice)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Meetup Location
                  </p>
                  <p className="text-base">
                    {transaction.meetupLocation?.name ?? 'Not set'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Meetup Time</p>
                  <p className="text-base">
                    {transaction.meetupTime
                      ? format(new Date(transaction.meetupTime), 'PPp')
                      : 'Not set'}
                  </p>
                </div>
              </div>

              <TransactionOffersPanel
                transaction={transaction}
                currentUserId={user.id}
              />
            </section>

            {transaction.status !== TransactionStatus.COMPLETED && (
              <>
                <Separator />
                <TransactionActions
                  transaction={transaction}
                  userRole={userRole}
                  onAction={handleAction}
                  showHeader
                />
              </>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-lg font-semibold">Item</h3>
              <ListingCardCompact listing={transaction.listing} />
            </section>

            <Separator />

            <section className="space-y-3">
              <h3 className="text-lg font-semibold">
                {userRole === 'buyer' ? 'Seller' : 'Buyer'}
              </h3>
              <UserCardCompact user={counterparty} />
            </section>
          </aside>
        </div>
      </div>

      {dialog.transaction && dialog.action && (
        <TransactionActionDialog
          open={dialog.open}
          onOpenChange={(open) =>
            setDialog({ open, action: null, transaction: null })
          }
          transaction={dialog.transaction}
          action={dialog.action}
          onConfirm={handleConfirm}
          isPending={updateStatus.isPending}
        />
      )}
    </>
  );
}
