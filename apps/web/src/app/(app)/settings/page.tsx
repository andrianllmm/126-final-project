'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { authClient } from '@/shared/lib/auth-client';
import { SettingsView } from '@/features/users/components/settings-view';

export default function Page() {
  const router = useRouter();
  const session = authClient.useSession();

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

  return <SettingsView userId={userId} />;
}
