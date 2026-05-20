import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  acceptTransaction,
  rejectTransaction,
  completeTransaction,
  cancelTransaction,
} from '../api/transactions-api';
import type { TransactionAction } from '@repo/api';

const actionMap = {
  accept: acceptTransaction,
  reject: rejectTransaction,
  complete: completeTransaction,
  cancel: cancelTransaction,
} as const;

export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: string;
      action: TransactionAction;
    }) => {
      return actionMap[action](id);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({
        queryKey: ['transactions', variables.id],
      });
    },
  });
}
