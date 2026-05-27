'use client';

import type { ReactNode } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Check, X } from 'lucide-react';

import type { Offer, Transaction, TransactionStatus } from '@repo/api';

import { Button } from '@/shared/components/ui/button';
import { currencyFormatter } from '@/shared/lib/currency-formatter';
import { cn } from '@/shared/lib/utils';

import { OfferStatusBadge } from './offer-status-badge';

type Props = {
  offer: Offer;
  transaction: Transaction;
  currentUserId: string;
  counterpartyName: string;
  transactionStatus: TransactionStatus;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  acceptLoading: boolean;
  rejectLoading: boolean;
  className?: string;
};

function CompactField({
  label,
  changed,
  oldValue,
  newValue,
}: {
  label: string;
  changed: boolean;
  oldValue: ReactNode;
  newValue: ReactNode;
}) {
  if (!changed) return null;

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-md border px-3 py-2 text-sm">
      <span className="shrink-0 font-medium text-foreground">{label}</span>

      <div className="min-w-0 flex-1 flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-muted-foreground/60 line-through">
          {oldValue}
        </span>

        <span className="shrink-0 text-muted-foreground">→</span>

        <span className="min-w-0 flex-1 truncate font-medium text-primary">
          {newValue}
        </span>
      </div>
    </div>
  );
}

export function OfferCardCompact({
  offer,
  transaction,
  currentUserId,
  counterpartyName,
  transactionStatus,
  onAccept,
  onReject,
  acceptLoading,
  rejectLoading,
  className,
}: Props) {
  const proposerName =
    offer.proposerId === currentUserId ? 'You' : counterpartyName;

  const isRecipient = offer.proposerId !== currentUserId;

  const canAct =
    isRecipient &&
    offer.status === 'PENDING' &&
    transactionStatus !== 'COMPLETED' &&
    transactionStatus !== 'CANCELLED';

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
    <div className={cn('rounded-xl px-4 py-3', className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{proposerName} offered</p>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(offer.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="grid gap-2 xl:grid-cols-3">
            <CompactField
              label="Price"
              changed={priceChanged}
              oldValue={currencyFormatter.format(transaction.agreedPrice)}
              newValue={
                offer.price
                  ? currencyFormatter.format(offer.price)
                  : currencyFormatter.format(transaction.agreedPrice)
              }
            />

            <CompactField
              label="Location"
              changed={locationChanged}
              oldValue={transaction.meetupLocation?.name ?? 'Not set'}
              newValue={offer.meetupLocation?.name ?? ''}
            />

            <CompactField
              label="Time"
              changed={timeChanged}
              oldValue={
                transaction.meetupTime
                  ? formatDistanceToNow(new Date(transaction.meetupTime), {
                      addSuffix: true,
                    })
                  : 'Not set'
              }
              newValue={
                offer.meetupTime
                  ? formatDistanceToNow(new Date(offer.meetupTime), {
                      addSuffix: true,
                    })
                  : ''
              }
            />
          </div>
        </div>

        {canAct ? (
          <div className="flex shrink-0 items-center gap-2 lg:self-center">
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
        ) : null}
      </div>
    </div>
  );
}
