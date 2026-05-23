'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { MoneyInput } from '@/shared/components/ui/money-input';
import { DateTimePicker } from '@/shared/components/ui/date-time-picker';
import { Spinner } from '@/shared/components/ui/spinner';
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';

import { type Transaction } from '@repo/api';
import { useCreateOfferMutation } from '../hooks/use-transaction-offers';

function splitDateTime(date: Date | string | null | undefined) {
  if (!date) return { date: undefined, time: '' };

  const d = new Date(date);
  const time = format(d, 'HH:mm:ss');

  return { date: d, time };
}

function mergeDateTime(date?: Date, time?: string) {
  if (!date || !time) return undefined;

  const [h, m, s] = time.split(':').map(Number);

  const merged = new Date(date);
  merged.setHours(h || 0, m || 0, s || 0, 0);

  return merged;
}

function toTime(value: Date | string | null | undefined) {
  if (!value) return null;
  const d = new Date(value);
  const t = d.getTime();
  return Number.isNaN(t) ? null : t;
}

type Props = {
  transaction: Transaction;
  canCreateOffers: boolean;
  onSuccess?: () => void;
};

export function OfferForm({ transaction, canCreateOffers, onSuccess }: Props) {
  const createOfferMutation = useCreateOfferMutation();

  const initial = useMemo(() => {
    const { date, time } = splitDateTime(transaction.meetupTime);
    return {
      price: transaction.agreedPrice.toString(),
      meetupLocation: transaction.meetupLocation ?? '',
      date,
      time,
    };
  }, [transaction]);

  const [price, setPrice] = useState(initial.price);
  const [meetupLocation, setMeetupLocation] = useState(initial.meetupLocation);
  const [date, setDate] = useState<Date | undefined>(initial.date);
  const [time, setTime] = useState(initial.time);

  useEffect(() => {
    setPrice(initial.price);
    setMeetupLocation(initial.meetupLocation);
    setDate(initial.date);
    setTime(initial.time);
  }, [initial]);

  const canSubmit = useMemo(() => {
    if (!canCreateOffers) return false;

    const nextPrice = Number(price);
    const nextTime = mergeDateTime(date, time);

    return (
      Number.isFinite(nextPrice) &&
      (nextPrice !== transaction.agreedPrice ||
        meetupLocation.trim() !== (transaction.meetupLocation ?? '') ||
        toTime(nextTime) !== toTime(transaction.meetupTime))
    );
  }, [price, meetupLocation, date, time, transaction, canCreateOffers]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit) {
      toast.error('Change at least one field before sending an offer');
      return;
    }

    const nextPrice = Number(price);
    const nextTime = mergeDateTime(date, time);

    createOfferMutation.mutate(
      {
        transactionId: transaction.transactionId,
        ...(nextPrice !== transaction.agreedPrice && { price: nextPrice }),
        ...(meetupLocation.trim() !== (transaction.meetupLocation ?? '') && {
          meetupLocation: meetupLocation.trim(),
        }),
        ...(toTime(nextTime) !== toTime(transaction.meetupTime) && {
          meetupTime: nextTime,
        }),
      },
      {
        onSuccess: () => {
          toast.success('Offer sent');
          onSuccess?.();
        },
        onError: () => toast.error('Failed to send offer'),
      },
    );
  };

  if (!canCreateOffers) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FieldGroup className="space-y-2">
        <Field>
          <FieldLabel>Agreed Price</FieldLabel>
          <MoneyInput
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPrice(e.target.value)
            }
          />
        </Field>
      </FieldGroup>

      <FieldGroup className="space-y-2">
        <Field>
          <FieldLabel>Meetup Location</FieldLabel>
          <Input
            value={meetupLocation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMeetupLocation(e.target.value)
            }
          />
        </Field>
      </FieldGroup>

      <FieldGroup className="space-y-2">
        <Field>
          <FieldLabel>Meetup Time</FieldLabel>

          <DateTimePicker
            date={date}
            time={time}
            onDateChange={setDate}
            onTimeChange={setTime}
            showLabels={false}
          />
        </Field>
      </FieldGroup>

      <div className="flex justify-end pt-2">
        <Button disabled={!canSubmit || createOfferMutation.isPending}>
          {createOfferMutation.isPending ? (
            <span className="inline-flex items-center gap-2">
              <Spinner className="size-4" />
              Sending...
            </span>
          ) : (
            'Send Offer'
          )}
        </Button>
      </div>
    </form>
  );
}
