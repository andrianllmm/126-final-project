'use client';

import { useEffect, useMemo, useState, ReactNode } from 'react';

import { currencyFormatter } from '@/shared/lib/currency-formatter';

import { Button } from '@/shared/components/ui/button';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

import type { Transaction, TransactionAction } from '@repo/api';

interface TransactionActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
  action: TransactionAction;
  onConfirm: (reason?: string) => void;
  isPending?: boolean;
}

type ActionConfig = {
  title: string;
  confirmLabel: string;
  pendingLabel: string;
  variant: 'default' | 'destructive';
  requiresReason?: boolean;
};

const ACTION_CONFIG: Record<TransactionAction, ActionConfig> = {
  accept: {
    title: 'Accept Transaction Request?',
    confirmLabel: 'Accept Request',
    pendingLabel: 'Accepting...',
    variant: 'default',
  },
  reject: {
    title: 'Reject Transaction Request?',
    confirmLabel: 'Reject Request',
    pendingLabel: 'Rejecting...',
    variant: 'destructive',
  },
  complete: {
    title: 'Mark Transaction as Complete?',
    confirmLabel: 'Complete Transaction',
    pendingLabel: 'Completing...',
    variant: 'default',
  },
  cancel: {
    title: 'Cancel This Transaction?',
    confirmLabel: 'Cancel Transaction',
    pendingLabel: 'Cancelling...',
    variant: 'destructive',
    requiresReason: true,
  },
};

function InfoBox({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-md bg-muted p-3 text-sm">
      {title ? <div className="mb-1 font-medium">{title}</div> : null}
      {children}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-inside list-disc space-y-1 text-muted-foreground">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  );
}

function getActionContent(params: {
  action: TransactionAction;
  transaction: Transaction;
  counterpartyName: string;
}): ReactNode {
  const { action, transaction, counterpartyName } = params;

  const title = transaction.listing.title;
  const price = currencyFormatter.format(transaction.agreedPrice);

  switch (action) {
    case 'accept':
      return (
        <>
          <div>
            By accepting, you agree to sell{' '}
            <span className="font-semibold">{title}</span> to{' '}
            <span className="font-semibold">{transaction.buyer.name}</span> for{' '}
            <span className="font-semibold">{price}</span>.
          </div>

          <InfoBox title="What happens next">
            <List
              items={[
                'The listing will be marked as RESERVED',
                'Other buyers cannot request this item',
                'Coordinate details via chat',
              ]}
            />
          </InfoBox>
        </>
      );

    case 'reject':
      return (
        <>
          <div>
            This will decline{' '}
            <span className="font-semibold">{transaction.buyer.name}</span>
            &apos;s request to buy{' '}
            <span className="font-semibold">{title}</span>.
          </div>

          <InfoBox>
            The listing will remain available for other buyers. This action
            cannot be undone.
          </InfoBox>
        </>
      );

    case 'complete':
      return (
        <>
          <div>
            Confirm completion with{' '}
            <span className="font-semibold">{transaction.buyer.name}</span>?
          </div>

          <InfoBox title="This action will">
            <List
              items={[
                'Mark the listing as SOLD',
                'Close this transaction',
                'Cannot be undone',
              ]}
            />
          </InfoBox>

          <Alert>
            <AlertCircle className="size-4" />
            <AlertDescription>
              Both parties will be asked to rate the transaction.
            </AlertDescription>
          </Alert>
        </>
      );

    case 'cancel':
      return (
        <>
          <div>Are you sure you want to cancel this transaction?</div>

          <InfoBox title="This will">
            <List
              items={[
                'Make the listing available again',
                `Notify ${counterpartyName}`,
                'Keep a record in your history',
              ]}
            />
          </InfoBox>
        </>
      );
  }
}

export function TransactionActionDialog({
  open,
  onOpenChange,
  transaction,
  action,
  onConfirm,
  isPending = false,
}: TransactionActionDialogProps) {
  const [reason, setReason] = useState<string>('');

  const config = ACTION_CONFIG[action];

  const counterpartyName = useMemo<string>(() => {
    return (
      transaction.buyer?.name ?? transaction.seller?.name ?? 'the other party'
    );
  }, [transaction.buyer?.name, transaction.seller?.name]);

  useEffect(() => {
    if (!open) setReason('');
  }, [open]);

  const handleClose = (nextOpen: boolean): void => {
    onOpenChange(nextOpen);
    if (!nextOpen) setReason('');
  };

  const handleConfirm = (): void => {
    if (action === 'cancel') {
      onConfirm(reason.trim() || undefined);
      setReason('');
      return;
    }

    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {getActionContent({
            action,
            transaction,
            counterpartyName,
          })}
        </div>

        {config.requiresReason && (
          <div className="space-y-2 pt-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Let the other party know..."
              className="text-sm"
              maxLength={500}
              rows={3}
            />
            <div className="text-right text-xs text-muted-foreground">
              {reason.length}/500
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isPending}
          >
            {action === 'cancel' ? 'Go Back' : 'Cancel'}
          </Button>

          <Button
            variant={config.variant}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? config.pendingLabel : config.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
