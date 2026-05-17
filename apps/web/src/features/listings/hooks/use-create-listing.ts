import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createListing } from '../api/listings-api';

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}
