import type { Message } from '@repo/api';
import { ChatBubble } from './chat-bubble';

type Props = {
  messages: Message[];
  currentUserId?: string;
};

export function ChatMessageList({ messages, currentUserId }: Props) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full min-h-56 items-center justify-center px-6 text-center text-sm text-muted-foreground">
        No messages yet. Start the conversation below.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          message={message}
          isOwn={message.senderId === currentUserId}
        />
      ))}
    </div>
  );
}
