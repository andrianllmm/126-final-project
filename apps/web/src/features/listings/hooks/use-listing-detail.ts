import { useQuery } from '@tanstack/react-query';
import { getListing } from '../api/listings-api';

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listings', id],
    queryFn: () => getListing(id),
    enabled: Boolean(id),
  });
}
