import { useQuery } from '@tanstack/react-query';
import { getListingTransactions } from '../api/listings-api';
import { type TransactionStatus } from '@repo/api';

export function useListingTransactions(
  listingId: string,
  status?: TransactionStatus | TransactionStatus[],
) {
  return useQuery({
    queryKey: ['listing-transactions', listingId, status],
    queryFn: () => getListingTransactions(listingId, status),
    enabled: !!listingId,
  });
}
