import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createConversation,
  getConversation,
  getConversations,
  markConversationAsRead,
} from '../api/messaging-api';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });
};

export const useConversation = (id?: string) => {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: () => getConversation(id!),
    enabled: !!id,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['conversations'],
      });
    },
  });
};

export const useMarkConversationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markConversationAsRead,
    onSuccess: async (_, conversationId) => {
      await queryClient.invalidateQueries({
        queryKey: ['conversation', conversationId],
      });

      await queryClient.invalidateQueries({
        queryKey: ['conversations'],
      });
    },
  });
};
