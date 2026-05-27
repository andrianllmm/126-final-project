'use client';

import { toast } from 'sonner';

import {
  TransactionStatus,
  type Conversation,
  type Transaction,
} from '@repo/api';

import { useListingTransactions } from '@/features/listings/hooks/use-listing-transactions';
import {
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useTransactionOffers,
} from '@/features/transactions/hooks/use-transaction-offers';
import { OfferCardCompact } from '@/features/transactions/components/offer-card-compact';

type Props = {
  conversation?: Conversation;
  currentUserId?: string;
};

function getActiveTransaction(
  transactions: Transaction[] | undefined,
  conversation: Conversation,
) {
  return (
    transactions?.find(
      (transaction) =>
        transaction.buyerId === conversation.buyerId &&
        transaction.sellerId === conversation.sellerId,
    ) ?? null
  );
}

export function LatestOfferBanner({ conversation, currentUserId }: Props) {
  const { data: listingTransactions } = useListingTransactions(
    conversation?.listingId ?? '',
    [TransactionStatus.PENDING, TransactionStatus.ACCEPTED],
  );

  const activeTransaction = conversation
    ? getActiveTransaction(listingTransactions, conversation)
    : null;

  const { data: offers } = useTransactionOffers(
    activeTransaction?.transactionId ?? '',
  );

  const acceptOfferMutation = useAcceptOfferMutation();
  const rejectOfferMutation = useRejectOfferMutation();

  if (!conversation || !currentUserId || !activeTransaction) {
    return null;
  }

  const latestActionableOffer =
    offers
      ?.filter((offer) => offer.status === 'PENDING')
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0] ?? null;

  if (!latestActionableOffer) {
    return null;
  }

  const counterparty =
    activeTransaction.buyerId === currentUserId
      ? activeTransaction.seller
      : activeTransaction.buyer;

  return (
    <div className="border-b bg-muted/20 px-4 py-3 sm:px-6">
      <OfferCardCompact
        offer={latestActionableOffer}
        transaction={activeTransaction}
        currentUserId={currentUserId}
        counterpartyName={counterparty.name}
        transactionStatus={activeTransaction.status}
        onAccept={(id) =>
          acceptOfferMutation.mutate(
            { id, transactionId: activeTransaction.transactionId },
            {
              onSuccess: () => toast.success('Offer accepted'),
              onError: () => toast.error('Failed to accept offer'),
            },
          )
        }
        onReject={(id) =>
          rejectOfferMutation.mutate(
            { id, transactionId: activeTransaction.transactionId },
            {
              onSuccess: () => toast.success('Offer rejected'),
              onError: () => toast.error('Failed to reject offer'),
            },
          )
        }
        acceptLoading={acceptOfferMutation.isPending}
        rejectLoading={rejectOfferMutation.isPending}
      />
    </div>
  );
}
