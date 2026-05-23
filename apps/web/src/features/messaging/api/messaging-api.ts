import { apiClient } from '@/shared/lib/api-client';
import { type Conversation, type ConversationList } from '@repo/api';

export const getOrCreateConversation = (listingId: string) =>
  apiClient.post<Conversation, { listingId: string }>(
    '/messaging/conversations',
    { listingId },
  );

export const getConversations = () =>
  apiClient.get<ConversationList>('/messaging/conversations');

export const getConversation = (id: string) =>
  apiClient.get<Conversation>(`/messaging/conversations/${id}`);

export const markConversationAsRead = (id: string) =>
  apiClient.post<void>(`/messaging/conversations/${id}/read`, {});

export const getUnreadCount = () =>
  apiClient.get<number>('/messaging/unread-count');
