import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteListing } from '../api/listings-api';

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}
