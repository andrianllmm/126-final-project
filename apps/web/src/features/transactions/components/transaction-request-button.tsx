'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import {
  createSignInUrl,
  getCurrentPathWithSearch,
} from '@/shared/lib/auth-redirect';

import { useListingTransactions } from '@/features/listings/hooks/use-listing-transactions';

import { ListingStatus, TransactionStatus, type Listing } from '@repo/api';

interface TransactionRequestButtonProps {
  listing: Listing;
  className?: string;
}

export function TransactionRequestButton({
  listing,
  className,
}: TransactionRequestButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPath = getCurrentPathWithSearch(pathname, searchParams);

  const { data: transactions, isLoading } = useListingTransactions(listing.id, [
    TransactionStatus.PENDING,
    TransactionStatus.ACCEPTED,
  ]);

  const activeTransaction = transactions?.find((t) => t.buyerId === user?.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast.error('Please sign in to buy');
      router.replace(createSignInUrl(currentPath));
      return;
    }

    if (user.id === listing.seller.id) {
      return;
    }

    if (activeTransaction) {
      router.push(`/transactions/${activeTransaction.transactionId}`);
      return;
    }

    router.push(`/listings/${listing.id}/buy`);
  };

  const isDisabled = listing.status !== ListingStatus.AVAILABLE || isLoading;

  const label = activeTransaction ? 'Continue request' : 'Buy';

  if (!user) {
    return (
      <Button
        size="lg"
        className={cn('w-full', className)}
        onClick={handleClick}
        disabled={listing.status !== ListingStatus.AVAILABLE}
      >
        Buy
      </Button>
    );
  }

  if (user.id === listing.seller.id) {
    return null;
  }

  return (
    <Button
      size="lg"
      className={cn('w-full', className)}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {label}
    </Button>
  );
}
