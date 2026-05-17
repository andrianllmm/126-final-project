import { useEffect, useRef } from 'react';
import Link from 'next/link';

import { authClient } from '@/shared/lib/auth-client';

import { useMessaging } from '../../hooks/use-messaging';

import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { ChatComposer } from './message-composer';
import { ChatThreadHeader } from './thread-header';
import { ChatMessageList } from './message-list';
import { TypingBubble } from './typing-bubble';

import { ArrowLeftIcon } from 'lucide-react';

type Props = {
  conversationId?: string;
  showBackButton?: boolean;
};

export function ChatThread({ conversationId, showBackButton }: Props) {
  const session = authClient.useSession();

  const {
    messages,
    sendMessage,
    sendTypingStatus,
    isConnected,
    isPeerTyping,
    conversation,
    isConversationLoading,
  } = useMessaging(conversationId);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = session.data?.user?.id;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages, isPeerTyping]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {showBackButton ? (
            <Button
              size="icon-sm"
              variant="ghost"
              asChild
              className="md:hidden"
            >
              <Link href="/messages" aria-label="Back to conversations">
                <ArrowLeftIcon className="size-5" />
              </Link>
            </Button>
          ) : null}

          <ChatThreadHeader
            conversation={conversation}
            currentUserId={currentUserId}
            isLoading={isConversationLoading}
          />
        </div>

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
          {isPeerTyping ? <TypingBubble side="other" className="mt-3" /> : null}
          <div ref={bottomRef} />
        </div>

        <div className="border-t px-4 py-4 sm:px-6">
          <ChatComposer
            onSend={sendMessage}
            onTypingStateChange={sendTypingStatus}
            disabled={!conversationId}
          />
        </div>
      </div>
    </div>
  );
}
