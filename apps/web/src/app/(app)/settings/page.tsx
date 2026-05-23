'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/features/auth/hooks/use-auth';

import { SettingsView } from '@/features/users/components/settings/settings-view';

export default function Page() {
  const router = useRouter();

  const { user, isPending } = useAuth();

  const userId = user?.id;

  useEffect(() => {
    if (isPending) return;

    if (!userId) {
      router.replace('/sign-in');
    }
  }, [router, isPending, userId]);

  if (isPending || !userId) {
    return null;
  }

  return <SettingsView userId={userId} />;
}
