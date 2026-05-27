'use client';

import { useParams, useRouter } from 'next/navigation';

import { useSession } from '@/features/auth/hooks/use-session';
import { useTransaction } from '@/features/transactions/hooks/use-transaction';
import { Spinner } from '@/shared/components/ui/spinner';
import { ReviewForm } from '@/features/reviews/components/review-form';

export default function TransactionReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user ?? null;

  const { data: transaction, isLoading } = useTransaction(params?.id ?? '');

  if (!user) return null;

  if (isLoading) {
    return (
      <main className="page-container flex min-h-screen items-center justify-center">
        <Spinner className="size-7 text-primary" />
      </main>
    );
  }

  if (!transaction) {
    return (
      <main className="page-container py-12">
        <div className="mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">Review not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The transaction could not be loaded.
          </p>
          <button
            type="button"
            onClick={() => router.push('/transactions')}
            className="mt-6 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
          >
            Back to transactions
          </button>
        </div>
      </main>
    );
  }

  if (transaction.status !== 'COMPLETED') {
    return (
      <main className="page-container py-12">
        <div className="mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">Review unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You can only leave a review after the transaction is completed.
          </p>
          <button
            type="button"
            onClick={() =>
              router.push(`/transactions/${transaction.transactionId}`)
            }
            className="mt-6 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
          >
            Back to transaction
          </button>
        </div>
      </main>
    );
  }

  const isBuyer = transaction.buyerId === user.id;
  const targetName = isBuyer ? transaction.seller.name : transaction.buyer.name;
  const title = `Leave a review for ${targetName}`;
  const description = isBuyer
    ? `Tell others about your experience buying ${transaction.listing.title}.`
    : `Tell others about your experience selling ${transaction.listing.title}.`;

  return (
    <ReviewForm
      transactionId={transaction.transactionId}
      listingId={transaction.listingId}
      targetName={targetName}
      title={title}
      description={description}
    />
  );
}
