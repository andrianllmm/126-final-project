'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useListing } from '@/features/listings/hooks/use-listing-detail';
import { useCreateTransaction } from '@/features/transactions/hooks/use-create-transaction';
import { ListingStatus, type CreateTransactionInput } from '@repo/api';
import { toast } from 'sonner';
import { Spinner } from '@/shared/components/ui/spinner';
import { UserCardCompact } from '@/features/users/components/user-card-compact';
import { ListingCardCompact } from '@/features/transactions/components/listing-card-compact';
import { MessageButton } from '@/features/messaging/components/message-button';

export default function BuyListingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const listingId = params.id as string;

  const { data: listing, isLoading } = useListing(listingId);
  const createTransaction = useCreateTransaction();

  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (!isLoading && !listing) {
      toast.error('Listing not found');
      router.push('/');
    }
  }, [isLoading, listing, router]);

  useEffect(() => {
    if (listing && user && user.id === listing.seller.id) {
      toast.error('You cannot buy your own listing');
      router.push(`/listings/${listingId}`);
    }
  }, [listing, user, router, listingId]);

  useEffect(() => {
    if (listing && listing.status !== ListingStatus.AVAILABLE) {
      toast.error('This item is no longer available');
      router.push(`/listings/${listingId}`);
    }
  }, [listing, router, listingId]);

  if (!user || isLoading || !listing) {
    return (
      <div className="container max-w-3xl py-10 flex items-center justify-center min-h-100">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  const canSubmit = termsAccepted;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const data: CreateTransactionInput = {
      listingId: listing.id,
    };

    createTransaction.mutate(data, {
      onSuccess: (transaction) => {
        toast.success('Transaction request sent!');
        router.push(`/transactions/${transaction.transactionId}`);
      },
      onError: (error: unknown) => {
        const message =
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: { data?: { message?: string } } })
            .response?.data?.message === 'string'
            ? (error as { response: { data: { message: string } } }).response
                .data.message
            : 'Failed to send request';

        toast.error(message);
      },
    });
  };

  return (
    <div className="container max-w-3xl py-10 space-y-10">
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.push(`/listings/${listingId}`)}
          className="px-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to listing
        </Button>

        <div>
          <h1 className="text-2xl font-semibold">Review request</h1>
          <p className="text-sm text-muted-foreground">
            Confirm before sending your purchase request
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-3">You will request</h3>
          <ListingCardCompact listing={listing} />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Sold by</h3>
          <UserCardCompact user={listing.seller} />
        </div>

        <Separator />

        <Alert>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
              <li>Seller will be notified</li>
              <li>You can message while waiting</li>
              <li>No payment is processed yet</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Separator />

        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Still not sure?</h3>
          <MessageButton listingId={listingId}>
            Message the seller
          </MessageButton>
        </div>

        <Separator />

        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(!!checked)}
          />
          <label htmlFor="terms" className="text-sm leading-tight">
            I understand the transaction process
          </label>
        </div>

        <Button
          size="lg"
          className="w-full gap-2"
          disabled={!canSubmit || createTransaction.isPending}
          onClick={handleSubmit}
        >
          {createTransaction.isPending
            ? 'Sending Request...'
            : 'Send Purchase Request'}
        </Button>
      </div>
    </div>
  );
}
