'use client';

import { format } from 'date-fns';
import { Check, X } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { currencyFormatter } from '@/shared/lib/currency-formatter';
import { cn } from '@/shared/lib/utils';

import { Offer, OfferStatus, TransactionStatus, Transaction } from '@repo/api';

import { OfferStatusBadge } from './offer-status-badge';

type Props = {
  offer: Offer;
  transaction: Transaction;
  index: number;
  currentUserId: string;
  counterpartyName: string;
  transactionStatus: TransactionStatus;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  acceptLoading: boolean;
  rejectLoading: boolean;
};

function DiffValue({
  changed,
  oldValue,
  newValue,
}: {
  changed: boolean;
  oldValue: React.ReactNode;
  newValue: React.ReactNode;
}) {
  if (!changed) {
    return <span className="text-muted-foreground">{oldValue}</span>;
  }

  return (
    <span className="flex flex-wrap items-center gap-2">
      <span className="line-through text-muted-foreground/50">{oldValue}</span>
      <span className="text-primary">{newValue}</span>
    </span>
  );
}

export function OfferCard({
  offer,
  transaction,
  index,
  currentUserId,
  counterpartyName,
  transactionStatus,
  onAccept,
  onReject,
  acceptLoading,
  rejectLoading,
}: Props) {
  const proposerName =
    offer.proposerId === currentUserId ? 'You' : counterpartyName;

  const isRecipient = offer.proposerId !== currentUserId;

  const canAct =
    isRecipient &&
    offer.status === OfferStatus.PENDING &&
    transactionStatus !== TransactionStatus.COMPLETED &&
    transactionStatus !== TransactionStatus.CANCELLED;

  const priceChanged =
    offer.price !== null &&
    offer.price !== undefined &&
    Number(offer.price) !== Number(transaction.agreedPrice);

  const locationChanged =
    offer.meetupLocation !== null &&
    offer.meetupLocation !== undefined &&
    offer.meetupLocation !== transaction.meetupLocation;

  const timeChanged =
    offer.meetupTime !== null &&
    offer.meetupTime !== undefined &&
    new Date(offer.meetupTime).getTime() !==
      new Date(transaction.meetupTime ?? 0).getTime();

  return (
    <div
      className={cn(
        'rounded-lg border-2 bg-card p-4 space-y-4',
        index === 0 && 'border-primary/30',
      )}
    >
      <div className="flex justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{proposerName}</p>
            <OfferStatusBadge status={offer.status} />
          </div>

          <p className="text-xs text-muted-foreground">
            {format(new Date(offer.createdAt), 'PPp')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="space-y-1">
          <p className="text-sm">Price</p>
          <DiffValue
            changed={priceChanged}
            oldValue={currencyFormatter.format(transaction.agreedPrice)}
            newValue={
              offer.price
                ? currencyFormatter.format(offer.price)
                : currencyFormatter.format(transaction.agreedPrice)
            }
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm">Location</p>
          <DiffValue
            changed={locationChanged}
            oldValue={transaction.meetupLocation?.name ?? 'Not set'}
            newValue={offer.meetupLocation?.name ?? ''}
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm">Time</p>
          <DiffValue
            changed={timeChanged}
            oldValue={
              transaction.meetupTime
                ? format(new Date(transaction.meetupTime), 'PPp')
                : 'Not set'
            }
            newValue={
              offer.meetupTime ? format(new Date(offer.meetupTime), 'PPp') : ''
            }
          />
        </div>
      </div>

      {canAct && (
        <>
          <Separator />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onAccept(offer.id)}
              disabled={acceptLoading}
              className="gap-2"
            >
              <Check className="size-4" />
              Accept
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onReject(offer.id)}
              disabled={rejectLoading}
              className="gap-2"
            >
              <X className="size-4" />
              Reject
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
