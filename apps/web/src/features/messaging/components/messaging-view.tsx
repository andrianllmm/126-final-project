import { ChatThread } from './chat-thread';
import { ConversationList } from './conversation-list';

export function MessagingView({ conversationId }: { conversationId?: string }) {
  return (
    <div className="grid h-full min-h-0 bg-muted/20 lg:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="min-h-0 border-r bg-background">
        <ConversationList />
      </aside>

      <main className="min-h-0 bg-background">
        {conversationId ? (
          <ChatThread conversationId={conversationId} />
        ) : (
          <div className="flex h-full items-center justify-center px-6">
            <div className="max-w-sm space-y-2 text-center">
              <div className="text-sm font-medium text-foreground">
                Select a conversation
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
