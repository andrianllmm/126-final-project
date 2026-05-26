import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getSocket, initializeSocket } from '@/shared/lib/socket-client';
import type { Conversation, Message } from '@repo/api';
import { useConversation } from './use-conversations';

export const useMessaging = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const conversationQuery = useConversation(conversationId);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const hydratedConversationIdRef = useRef<string | undefined>(undefined);
  const activeConversationIdRef = useRef<string | undefined>(conversationId);
  const peerTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    activeConversationIdRef.current = conversationId;
  }, [conversationId]);

  const upsertMessage = (message: Message) => {
    setMessages((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === message.id);

      if (existingIndex === -1) {
        return [...prev, message];
      }

      const next = [...prev];
      next[existingIndex] = message;
      return next;
    });
  };

  useEffect(() => {
    setMessages([]);
    hydratedConversationIdRef.current = undefined;
    setIsPeerTyping(false);

    if (peerTypingTimeoutRef.current) {
      clearTimeout(peerTypingTimeoutRef.current);
      peerTypingTimeoutRef.current = null;
    }
  }, [conversationId]);

  const sendTypingStatus = useCallback(
    (isTyping: boolean) => {
      const socket = getSocket('/messaging');

      if (!socket || !conversationId) return;

      socket.emit('typing', { conversationId, isTyping });
    },
    [conversationId],
  );

  useEffect(() => {
    const initialMessages = conversationQuery.data?.messages as
      | Message[]
      | undefined;

    if (
      conversationId &&
      initialMessages &&
      hydratedConversationIdRef.current !== conversationId
    ) {
      setMessages((prev) => {
        const next = [...prev];

        for (const message of initialMessages) {
          const existingIndex = next.findIndex(
            (item) => item.id === message.id,
          );

          if (existingIndex === -1) {
            next.push(message);
            continue;
          }

          next[existingIndex] = message;
        }

        return next;
      });
      hydratedConversationIdRef.current = conversationId;
    }
  }, [conversationId, conversationQuery.data?.messages]);

  useEffect(() => {
    const socket = initializeSocket('/messaging');
    const currentUserId = user?.id;

    if (!conversationId || !currentUserId) return;

    const hasUnreadIncomingMessages = messages.some(
      (message) => message.senderId !== currentUserId && !message.isRead,
    );

    if (!hasUnreadIncomingMessages) return;

    socket.emit('markAsRead', conversationId);
  }, [conversationId, messages, user?.id]);

  useEffect(() => {
    const socket = initializeSocket('/messaging');
    const currentUserId = user?.id;

    const handleConnect = () => {
      setIsConnected(true);

      if (conversationId) {
        socket.emit('joinConversation', conversationId);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleNewMessage = (message: Message) => {
      if (message.conversationId !== activeConversationIdRef.current) return;

      if (message.senderId !== currentUserId) {
        setIsPeerTyping(false);

        if (peerTypingTimeoutRef.current) {
          clearTimeout(peerTypingTimeoutRef.current);
          peerTypingTimeoutRef.current = null;
        }
      }

      upsertMessage(message);
    };

    const handleUserTyping = (payload: {
      userId: string;
      conversationId: string;
      isTyping: boolean;
    }) => {
      if (payload.conversationId !== activeConversationIdRef.current) return;
      if (payload.userId === currentUserId) return;

      if (!payload.isTyping) {
        setIsPeerTyping(false);

        if (peerTypingTimeoutRef.current) {
          clearTimeout(peerTypingTimeoutRef.current);
          peerTypingTimeoutRef.current = null;
        }

        return;
      }

      setIsPeerTyping(true);

      if (peerTypingTimeoutRef.current) {
        clearTimeout(peerTypingTimeoutRef.current);
      }

      peerTypingTimeoutRef.current = setTimeout(() => {
        setIsPeerTyping(false);
        peerTypingTimeoutRef.current = null;
      }, 2500);
    };

    const handleMessagesRead = (payload: {
      conversationId: string;
      readBy: string;
    }) => {
      if (payload.conversationId !== activeConversationIdRef.current) return;

      setMessages((prev) =>
        prev.map((message) =>
          message.senderId !== payload.readBy
            ? { ...message, isRead: true }
            : message,
        ),
      );

      queryClient.setQueryData(
        ['conversation', payload.conversationId] as const,
        (currentConversation: Conversation | undefined) => {
          if (!currentConversation) return currentConversation;

          return {
            ...currentConversation,
            messages: currentConversation.messages?.map((message) => ({
              ...message,
              isRead: true,
            })),
          };
        },
      );

      queryClient.setQueryData(
        ['conversations'] as const,
        (currentConversations: Conversation[] | undefined) => {
          if (!currentConversations) return currentConversations;

          return currentConversations.map((conversation) =>
            conversation.id === payload.conversationId
              ? {
                  ...conversation,
                  messages: conversation.messages?.map((message) => ({
                    ...message,
                    isRead: true,
                  })),
                }
              : conversation,
          );
        },
      );
    };

    const handleConnectError = (error: unknown) => {
      setIsConnected(false);
      console.error('Socket connect error:', error);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('newMessage', handleNewMessage);
    socket.on('messageSent', handleNewMessage);
    socket.on('messagesRead', handleMessagesRead);
    socket.on('userTyping', handleUserTyping);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      if (conversationId) {
        socket.emit('leaveConversation', conversationId);
      }

      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('newMessage', handleNewMessage);
      socket.off('messageSent', handleNewMessage);
      socket.off('messagesRead', handleMessagesRead);
      socket.off('userTyping', handleUserTyping);

      if (peerTypingTimeoutRef.current) {
        clearTimeout(peerTypingTimeoutRef.current);
        peerTypingTimeoutRef.current = null;
      }
    };
  }, [conversationId, queryClient, user?.id]);

  const sendMessage = (content: string) => {
    const socket = getSocket('/messaging');
    if (!socket || !conversationId) return;

    socket.emit(
      'sendMessage',
      {
        conversationId,
        content,
      },
      (response: unknown) => {
        if (!response || typeof response !== 'object') return;

        const data =
          'data' in response ? (response as { data?: unknown }).data : response;

        if (data && typeof data === 'object' && 'id' in data) {
          upsertMessage(data as Message);
        }
      },
    );
  };

  return {
    messages,
    sendMessage,
    sendTypingStatus,
    isConnected,
    isPeerTyping,
    conversation: conversationQuery.data,
    isConversationLoading: conversationQuery.isLoading,
  };
};
