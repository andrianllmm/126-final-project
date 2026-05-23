import { useQuery } from '@tanstack/react-query';
import { getTransaction } from '../api/transactions-api';

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: () => getTransaction(id),
    enabled: !!id,
  });
}
