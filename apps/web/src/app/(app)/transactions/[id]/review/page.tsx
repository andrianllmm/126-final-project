'use client';

import { useParams, useRouter } from 'next/navigation';
import { Star } from 'lucide-react';

import { useSession } from '@/features/auth/hooks/use-session';
import { useTransaction } from '@/features/transactions/hooks/use-transaction';
import { Spinner } from '@/shared/components/ui/spinner';
import { useMyReviews } from '@/features/reviews/hooks/use-my-reviews';
import { ReviewRole, type Review } from '@repo/api';
import { ReviewForm } from '@/features/reviews/components/review-form';

export default function TransactionReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user ?? null;

  const { data: transaction, isLoading } = useTransaction(params?.id ?? '');
  const { data: myReviews, isLoading: isLoadingMyReviews } =
    useMyReviews(!!user);

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
  const reviewRole = isBuyer
    ? ReviewRole.BUYER_TO_SELLER
    : ReviewRole.SELLER_TO_BUYER;

  const existingReview: Review | null =
    myReviews?.find(
      (review) =>
        review.transactionId === transaction.transactionId &&
        review.role === reviewRole,
    ) ?? null;

  if (isLoadingMyReviews) {
    return (
      <main className="page-container flex min-h-screen items-center justify-center">
        <Spinner className="size-7 text-primary" />
      </main>
    );
  }

  const title = `Leave a review for ${targetName}`;
  const description = existingReview
    ? `You already reviewed ${transaction.listing.title}.`
    : isBuyer
      ? `Tell others about your experience buying ${transaction.listing.title}.`
      : `Tell others about your experience selling ${transaction.listing.title}.`;

  if (existingReview) {
    return (
      <main className="page-container py-12">
        <div className="mx-auto max-w-xl space-y-8">
          <div className="space-y-1">
            <p className="text-sm font-medium text-primary">{targetName}</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Your review
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="space-y-1">
              <p className="text-base font-medium">Your rating</p>
              <p className="text-xs text-muted-foreground">
                Your submitted rating.
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  className={
                    value <= existingReview.rating
                      ? 'size-9 fill-primary text-primary'
                      : 'size-9 fill-transparent text-muted-foreground/25'
                  }
                />
              ))}
            </div>
            <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
              {existingReview.comment || 'No written comment was left.'}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <ReviewForm
      transactionId={transaction.transactionId}
      listingId={transaction.listingId}
      targetName={targetName}
      title={title}
      description={description}
      existingReview={existingReview}
    />
  );
}
