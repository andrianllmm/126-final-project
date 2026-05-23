import Link from 'next/link';
import Image from 'next/image';

import { cn } from '@/shared/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { currencyFormatter } from '@/shared/lib/currency-formatter';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';

import { TransactionActions } from './transaction-actions';
import { TransactionStatusBadge } from './transaction-status-badge';

import type { Transaction, TransactionAction } from '@repo/api';

interface TransactionCardProps {
  transaction: Transaction;
  userRole: 'buyer' | 'seller';
  onAction?: (action: TransactionAction) => void;
  className?: string;
}

export function TransactionCard({
  transaction,
  userRole,
  onAction,
  className,
}: TransactionCardProps) {
  const counterparty =
    userRole === 'buyer' ? transaction.seller : transaction.buyer;
  const firstImage = transaction.listing.images[0]?.upload.url;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3 flex-1 min-w-0">
            <Link
              href={`/listings/${transaction.listingId}`}
              className="shrink-0"
            >
              <div className="relative size-16 rounded-md overflow-hidden bg-muted">
                {firstImage ? (
                  <Image
                    src={firstImage}
                    alt={transaction.listing.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <Link
                href={`/listings/${transaction.listingId}`}
                className="w-fit font-semibold text-lg hover:underline line-clamp-2"
              >
                {transaction.listing.title}
              </Link>
              <Link
                href={`/profile/${counterparty.id}`}
                className="text-muted-foreground hover:underline"
              >
                {userRole === 'buyer' ? 'Seller' : 'Buyer'}: {counterparty.name}
              </Link>
            </div>
          </div>
          <TransactionStatusBadge status={transaction.status} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-end">
          <div className="flex justify-between items-end gap-4">
            <div>
              <p className="text-primary text-2xl font-bold">
                {currencyFormatter.format(transaction.agreedPrice)}
              </p>

              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(transaction.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>

            {(transaction.meetupLocation || transaction.meetupTime) && (
              <div className="text-right space-y-1">
                {transaction.meetupLocation && (
                  <p className="text-xs text-muted-foreground">
                    {transaction.meetupLocation}
                  </p>
                )}

                {transaction.meetupTime && (
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.meetupTime), 'PPp')}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {onAction && (
              <TransactionActions
                transaction={transaction}
                userRole={userRole}
                onAction={onAction}
                variant="compact"
              />
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/transactions/${transaction.transactionId}`}>
                View
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
