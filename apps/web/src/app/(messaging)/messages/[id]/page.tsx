'use client';

import { use } from 'react';
import { MessagingView } from '@/features/messaging/components/messaging-view';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="h-screen">
      <MessagingView conversationId={id} />
    </div>
  );
}
