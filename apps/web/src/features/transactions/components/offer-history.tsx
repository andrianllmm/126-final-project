'use client';

import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Spinner } from '@/shared/components/ui/spinner';
import { Badge } from '@/shared/components/ui/badge';

import { TransactionStatus, type Transaction } from '@repo/api';

import {
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useTransactionOffers,
} from '../hooks/use-transaction-offers';

import { OfferCard } from './offer-card';

type OfferHistoryProps = {
  transaction: Transaction;
  currentUserId: string;
};

export function OfferHistory({
  transaction,
  currentUserId,
}: OfferHistoryProps) {
  const { data, isLoading } = useTransactionOffers(transaction.transactionId);

  const acceptOfferMutation = useAcceptOfferMutation();
  const rejectOfferMutation = useRejectOfferMutation();

  const isBuyer = transaction.buyerId === currentUserId;
  const isSeller = transaction.sellerId === currentUserId;
  const isParticipant = isBuyer || isSeller;

  const counterparty = isBuyer ? transaction.seller : transaction.buyer;

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
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Offer History</h3>
        </div>

        {transaction.status === TransactionStatus.COMPLETED && (
          <Badge variant="outline">Completed</Badge>
        )}

        {transaction.status === TransactionStatus.CANCELLED && (
          <Badge variant="outline">Cancelled</Badge>
        )}
      </div>

      {!isLoading && data?.length === 0 && (
        <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          No offers have been made in this transaction yet.
        </div>
      )}

      <div className="space-y-3">
        {data?.map((offer, index) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            transaction={transaction}
            index={index}
            currentUserId={currentUserId}
            counterpartyName={counterparty.name}
            transactionStatus={transaction.status}
            onAccept={handleAccept}
            onReject={handleReject}
            acceptLoading={acceptOfferMutation.isPending}
            rejectLoading={rejectOfferMutation.isPending}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <Spinner className="text-primary size-5" />
        </div>
      )}
    </section>
  );
}
