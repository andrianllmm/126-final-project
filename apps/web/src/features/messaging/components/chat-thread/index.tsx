import { useEffect, useRef } from 'react';

import { authClient } from '@/shared/lib/auth-client';
import { Badge } from '@/shared/components/ui/badge';

import { useMessaging } from '../../hooks/use-messaging';
import { ChatComposer } from './message-composer';
import { ChatThreadHeader } from './thread-header';
import { ChatMessageList } from './message-list';

export function ChatThread({ conversationId }: { conversationId?: string }) {
  const session = authClient.useSession();

  const {
    messages,
    sendMessage,
    isConnected,
    conversation,
    isConversationLoading,
  } = useMessaging(conversationId);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = session.data?.user?.id;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex items-center justify-between gap-3 border-b px-6 py-4">
        <ChatThreadHeader
          conversation={conversation}
          isLoading={isConversationLoading}
          currentUserId={currentUserId}
        />

        <Badge
          variant={isConnected ? 'secondary' : 'outline'}
          className="shrink-0"
        >
          {isConnected ? 'Live' : 'Offline'}
        </Badge>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <ChatMessageList messages={messages} currentUserId={currentUserId} />
          <div ref={bottomRef} />
        </div>

        <div className="border-t px-4 py-4 sm:px-6">
          <ChatComposer onSend={sendMessage} disabled={!conversationId} />
        </div>
      </div>
    </div>
  );
}
