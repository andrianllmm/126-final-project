import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateListingStatus } from '../api/listings-api';

export function useUpdateListingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Parameters<typeof updateListingStatus>[1];
    }) => updateListingStatus(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({
        queryKey: ['listings', variables.id],
      });
    },
  });
}
