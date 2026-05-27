'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { OfferHistory } from '@/features/transactions/components/offer-history';
import { useTransaction } from '@/features/transactions/hooks/use-transaction';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/shared/components/ui/button';

export default function TransactionOffersPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const router = useRouter();

  const { data: transaction, isLoading } = useTransaction(id);
  const { user } = useAuth();

  if (!user) return null;

  if (isLoading) {
    return (
      <main className="page-container py-6 text-sm text-muted-foreground">
        <div className="mx-auto max-w-3xl">Loading...</div>
      </main>
    );
  }

  if (!transaction) {
    return (
      <main className="page-container py-6 text-sm text-muted-foreground">
        <div className="mx-auto max-w-3xl">Transaction not found</div>
      </main>
    );
  }

  return (
    <main className="page-container py-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              router.push(`/transactions/${transaction.transactionId}`)
            }
          >
            <ArrowLeft className="size-4 mr-1" />
            Back
          </Button>
        </div>

        <OfferHistory transaction={transaction} currentUserId={user.id} />
      </div>
    </main>
  );
}
