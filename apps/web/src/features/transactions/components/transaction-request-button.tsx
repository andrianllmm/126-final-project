'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useRouter } from 'next/navigation';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';

import { ListingStatus, type Listing } from '@repo/api';

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

  const goToBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/listings/${listing.id}/buy`);
  };
  const goToSignIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.error('Please sign in to buy');
    router.push(`/sign-in`);
  };

  // Don't show if user is not logged in
  if (!user) {
    return (
      <Button
        size="lg"
        className={cn('w-full', className)}
        onClick={goToSignIn}
        disabled={listing.status !== ListingStatus.AVAILABLE}
      >
        Buy
      </Button>
    );
  }

  // Don't show if user is the seller
  if (user.id === listing.seller.id) {
    return null;
  }

  return (
    <Button
      size="lg"
      className={cn('w-full', className)}
      onClick={goToBuy}
      disabled={listing.status !== ListingStatus.AVAILABLE}
    >
      Buy
    </Button>
  );
}
