import { useEffect, useRef, useState } from 'react';
import { getSocket, initializeSocket } from '@/shared/lib/socket-client';
import type { Message } from '@repo/api';
import { useConversation } from './use-conversations';

export const useMessaging = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const conversationQuery = useConversation(conversationId);

  const hydratedConversationIdRef = useRef<string | undefined>(undefined);
  const activeConversationIdRef = useRef<string | undefined>(conversationId);

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
  }, [conversationId]);

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
      upsertMessage(message);
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
    };
  }, [conversationId]);

  const sendMessage = (content: string) => {
    const socket = getSocket();
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
    isConnected,
    conversation: conversationQuery.data,
    isConversationLoading: conversationQuery.isLoading,
  };
};
