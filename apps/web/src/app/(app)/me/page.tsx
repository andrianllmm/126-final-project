'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function Page() {
  const router = useRouter();

  const { user, isPending } = useAuth();

  useEffect(() => {
    if (isPending) return;

    if (!user?.id) {
      router.replace('/sign-in');
      return;
    }

    router.replace(`/profile/${user.id}`);
  }, [user?.id, isPending, router]);

  return null;
}
