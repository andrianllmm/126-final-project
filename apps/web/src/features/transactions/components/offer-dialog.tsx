'use client';

import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

import { OfferForm } from './offer-form';
import { type Transaction } from '@repo/api';

type Props = {
  transaction: Transaction;
  canCreateOffers: boolean;
  children: React.ReactNode;
};

export function OfferDialog({ transaction, canCreateOffers, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={!canCreateOffers}>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Offer</DialogTitle>
          <DialogDescription>
            Negotiate price, meetup location, or schedule
          </DialogDescription>
        </DialogHeader>

        <OfferForm
          transaction={transaction}
          canCreateOffers={canCreateOffers}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
