'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Info } from 'lucide-react';

import { TransactionStatus, type Conversation } from '@repo/api';

import { useListingTransactions } from '@/features/listings/hooks/use-listing-transactions';
import { ListingCardCompact } from '@/features/transactions/components/listing-card-compact';
import { TransactionStatusBadge } from '@/features/transactions/components/transaction-status-badge';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { OfferDialog } from '@/features/transactions/components/offer-dialog';
import { currencyFormatter } from '@/shared/lib/currency-formatter';
import { cn } from '@/shared/lib/utils';

type Props = {
  conversation: Conversation;
  currentUserId?: string;
  className?: string;
};

export function ConversationDetailsSheet({
  conversation,
  currentUserId,
  className,
}: Props) {
  const { data: transactions } = useListingTransactions(conversation.listingId);

  const transaction = transactions?.find(
    (item) =>
      item.buyerId === conversation.buyerId &&
      item.sellerId === conversation.sellerId,
  );

  const userRole =
    transaction && currentUserId
      ? transaction.buyerId === currentUserId
        ? 'buyer'
        : 'seller'
      : undefined;

  const listing = transaction?.listing ?? conversation.listing;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn('shrink-0', className)}
          aria-label="Open conversation details"
        >
          <Info className="size-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle>Conversation details</SheetTitle>
          <SheetDescription>
            Listing and transaction for this chat.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-6 py-5">
          <section className="space-y-3">
            <div className="text-sm font-medium text-foreground">Role</div>
            <div className="flex items-center gap-2">
              <Badge>{userRole === 'buyer' ? 'Buyer' : 'Seller'}</Badge>
            </div>
          </section>
          <section className="space-y-3">
            <div className="text-sm font-medium text-foreground">Listing</div>
            <ListingCardCompact listing={listing} />
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-foreground">
                Transaction
              </div>

              {transaction ? (
                <TransactionStatusBadge status={transaction.status} />
              ) : null}
            </div>

            {transaction ? (
              <div className="space-y-4 rounded-xl border p-4">
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Agreed price</dt>
                    <dd className="font-medium">
                      {currencyFormatter.format(transaction.agreedPrice)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">Meetup location</dt>
                    <dd className="font-medium">
                      {transaction.meetupLocation?.name || 'Not set'}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">Meetup time</dt>
                    <dd className="font-medium">
                      {transaction.meetupTime
                        ? format(new Date(transaction.meetupTime), 'PPp')
                        : 'Not set'}
                    </dd>
                  </div>
                </dl>

                <div className="space-y-2">
                  <OfferDialog
                    transaction={transaction}
                    canCreateOffers={
                      transaction.status !== TransactionStatus.COMPLETED &&
                      transaction.status !== TransactionStatus.CANCELLED
                    }
                  >
                    <Button className="w-full">Create Offer</Button>
                  </OfferDialog>
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={`/transactions/${transaction.transactionId}`}>
                      Open transaction
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed px-4 py-5 text-sm text-muted-foreground">
                No transaction has been created for this listing yet.
              </div>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
