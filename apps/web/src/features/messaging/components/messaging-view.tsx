'use client';

import { ChatThread } from './chat-thread';
import { ConversationList } from './conversation-list';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/components/ui/resizable';

export function MessagingView({ conversationId }: { conversationId?: string }) {
  return (
    <div className="h-full min-h-0 overflow-hidden">
      {/* mobile */}
      <div className="h-full min-h-0 overflow-hidden bg-background md:hidden">
        {conversationId ? (
          <ChatThread conversationId={conversationId} showBackButton />
        ) : (
          <ConversationList />
        )}
      </div>

      {/* desktop */}
      <div className="hidden h-full min-h-0 overflow-hidden bg-muted/20 md:flex">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full min-h-0"
        >
          <ResizablePanel
            defaultSize="25%"
            minSize="20%"
            maxSize="40%"
            className="min-h-0 border-r bg-background"
          >
            <ConversationList />
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel className="min-h-0 bg-background">
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
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
