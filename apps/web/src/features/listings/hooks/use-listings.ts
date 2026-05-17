import { useQuery } from '@tanstack/react-query';
import { getListings } from '../api/listings-api';

export function useListings() {
  return useQuery({
    queryKey: ['listings'],
    queryFn: getListings,
  });
}
