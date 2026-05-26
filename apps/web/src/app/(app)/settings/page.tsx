'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';

import { SettingsView } from '@/features/users/components/settings/settings-view';

export default function Page() {
  const { user } = useAuth();

  const userId = user?.id;

  if (!userId) return null;

  return <SettingsView userId={userId} />;
}
