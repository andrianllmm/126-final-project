'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/shared/lib/auth-client';

export default function Page() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user?.id) {
      router.replace('/login');
      return;
    }

    router.replace(`/profile/${session.user.id}`);
  }, [session, isPending, router]);

  return null;
}
