'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle, History } from 'lucide-react';
import { toast } from 'sonner';

import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';

import { TransactionStatus, type Transaction } from '@repo/api';

import {
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useTransactionOffers,
} from '../hooks/use-transaction-offers';

import { OfferDialog } from './offer-dialog';
import { OfferCard } from './offer-card';

type TransactionOffersPanelProps = {
  transaction: Transaction;
  currentUserId: string;
};

export function TransactionOffersPanel({
  transaction,
  currentUserId,
}: TransactionOffersPanelProps) {
  const router = useRouter();

  const { data, isLoading } = useTransactionOffers(transaction.transactionId);

  const acceptOfferMutation = useAcceptOfferMutation();
  const rejectOfferMutation = useRejectOfferMutation();

  const isBuyer = transaction.buyerId === currentUserId;
  const isSeller = transaction.sellerId === currentUserId;
  const isParticipant = isBuyer || isSeller;

  const counterparty = isBuyer ? transaction.seller : transaction.buyer;

  const canCreateOffers =
    isParticipant &&
    transaction.status !== TransactionStatus.COMPLETED &&
    transaction.status !== TransactionStatus.CANCELLED;

  // latest pending offer by createdAt (newest first)
  const latestActionableOffer =
    data
      ?.filter((o) => o.status === 'PENDING')
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0] ?? null;

  const handleAccept = (offerId: string) => {
    acceptOfferMutation.mutate(
      { id: offerId, transactionId: transaction.transactionId },
      {
        onSuccess: () => toast.success('Offer accepted'),
        onError: () => toast.error('Failed to accept offer'),
      },
    );
  };

  const handleReject = (offerId: string) => {
    rejectOfferMutation.mutate(
      { id: offerId, transactionId: transaction.transactionId },
      {
        onSuccess: () => toast.success('Offer rejected'),
        onError: () => toast.error('Failed to reject offer'),
      },
    );
  };

  if (!isParticipant) return null;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <OfferDialog
          transaction={transaction}
          canCreateOffers={canCreateOffers}
        >
          <Button>Create Offer</Button>
        </OfferDialog>

        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            router.push(`/transactions/${transaction.transactionId}/offers`)
          }
        >
          <History className="size-4" />
          History
        </Button>
      </div>

      {latestActionableOffer && (
        <OfferCard
          offer={latestActionableOffer}
          transaction={transaction}
          index={0}
          currentUserId={currentUserId}
          counterpartyName={counterparty.name}
          transactionStatus={transaction.status}
          onAccept={handleAccept}
          onReject={handleReject}
          acceptLoading={acceptOfferMutation.isPending}
          rejectLoading={rejectOfferMutation.isPending}
        />
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <Spinner className="size-5" />
        </div>
      )}

      {!canCreateOffers &&
        transaction.status !== TransactionStatus.COMPLETED &&
        transaction.status !== TransactionStatus.CANCELLED && (
          <div className="flex items-start gap-2 rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            Offer creation is disabled for this transaction.
          </div>
        )}
    </section>
  );
}
