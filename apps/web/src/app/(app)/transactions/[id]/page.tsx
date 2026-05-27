'use client';

import { useEffect, useState } from 'react';
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
import { ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import {
  TransactionAction,
  TransactionStatus,
  ReviewRole,
  type Transaction,
} from '@repo/api';
import { toast } from 'sonner';
import { CopyText } from '@/shared/components/copy-text';
import { MessageButton } from '@/features/messaging/components/message-button';
import { TransactionOffersPanel } from '@/features/transactions/components/transaction-offers-panel';
import { useMyReviews } from '@/features/reviews/hooks/use-my-reviews';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();

  const transactionId = params.id as string;

  const { data: session } = useSession();
  const user = session?.user ?? null;

  const { data: transaction, isLoading } = useTransaction(transactionId);
  const { data: myReviews, isLoading: isLoadingMyReviews } =
    useMyReviews(!!user);

  const updateStatus = useUpdateTransactionStatus();

  const userRole = transaction?.buyerId === user?.id ? 'buyer' : 'seller';
  const reviewRole =
    userRole === 'buyer'
      ? ReviewRole.BUYER_TO_SELLER
      : ReviewRole.SELLER_TO_BUYER;

  const hasReviewedThisTransaction = myReviews?.some(
    (review) =>
      review.transactionId === transaction?.transactionId &&
      review.role === reviewRole,
  );

  const existingReview = myReviews?.find(
    (review) =>
      review.transactionId === transaction?.transactionId &&
      review.role === reviewRole,
  );

  useEffect(() => {
    if (!user) return;
    if (!transaction) return;
    if (transaction.status !== TransactionStatus.COMPLETED) return;
    if (isLoadingMyReviews) return;
    if (hasReviewedThisTransaction) return;

    router.replace(`/transactions/${transaction.transactionId}/review`);
  }, [
    hasReviewedThisTransaction,
    isLoadingMyReviews,
    user,
    router,
    transaction,
  ]);

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
      <div className="page-container flex min-h-100 items-center justify-center py-8">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="page-container py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Transaction not found</p>
          <Button onClick={() => router.push('/transactions')}>Back</Button>
        </div>
      </div>
    );
  }

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
          if (dialog.action === 'complete') {
            router.push(`/transactions/${transaction.transactionId}/review`);
          }
        },
        onError: () => {
          toast.error('Failed to update transaction');
        },
      },
    );
  };

  return (
    <>
      <div className="page-container py-8">
        <Button
          variant="ghost"
          className="mb-2"
          onClick={() => router.push('/transactions')}
        >
          <ArrowLeft className="size-4 mr-1" />
          Back
        </Button>

        {/* MAIN + SIDEBAR LAYOUT */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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

            {transaction.status === TransactionStatus.COMPLETED && (
              <div className="flex justify-end">
                {existingReview ? (
                  <div className="flex items-center gap-1 rounded-md border px-3 py-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className={
                          value <= existingReview.rating
                            ? 'size-4 fill-primary text-primary'
                            : 'size-4 fill-transparent text-muted-foreground/25'
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <Button asChild size="sm" variant="outline">
                    <Link
                      href={`/transactions/${transaction.transactionId}/review`}
                    >
                      Leave review
                    </Link>
                  </Button>
                )}
              </div>
            )}

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
