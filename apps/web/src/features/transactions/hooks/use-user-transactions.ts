import { useQuery } from '@tanstack/react-query';
import { getUserTransactions } from '../api/transactions-api';
import { type TransactionQueryInput } from '@repo/api';

export function useUserTransactions(query?: TransactionQueryInput) {
  return useQuery({
    queryKey: ['transactions', query],
    queryFn: () => getUserTransactions(query),
  });
}
