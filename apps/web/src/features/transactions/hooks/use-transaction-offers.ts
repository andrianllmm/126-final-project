import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  acceptOffer,
  createOffer,
  getOffersByTransaction,
  rejectOffer,
} from '../api/offers-api';
import { type CreateOfferInput } from '@repo/api';

export function useTransactionOffers(transactionId: string) {
  return useQuery({
    queryKey: ['transactions', transactionId, 'offers'],
    queryFn: () => getOffersByTransaction(transactionId),
    enabled: !!transactionId,
  });
}

export function useCreateOfferMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOfferInput) => createOffer(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['transactions', variables.transactionId, 'offers'],
      });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useAcceptOfferMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; transactionId: string }) =>
      acceptOffer(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['transactions', variables.transactionId, 'offers'],
      });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useRejectOfferMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; transactionId: string }) =>
      rejectOffer(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['transactions', variables.transactionId, 'offers'],
      });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
