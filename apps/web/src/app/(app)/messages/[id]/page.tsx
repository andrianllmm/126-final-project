'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

import { authClient } from '@/shared/lib/auth-client';
import { MessagingView } from '@/features/messaging/components/messaging-view';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const session = authClient.useSession();

  const { id } = use(params);

  const userId = session.data?.user?.id;

  useEffect(() => {
    if (session.isPending) return;

    if (!userId) {
      router.replace('/sign-in');
    }
  }, [router, session.isPending, userId]);

  if (session.isPending || !userId) {
    return null;
  }

  return (
    <div className="h-screen">
      <MessagingView conversationId={id} />
    </div>
  );
}
