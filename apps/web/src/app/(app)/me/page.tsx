'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  createSignInUrl,
  getCurrentPathWithSearch,
} from '@/shared/lib/auth-redirect';

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnTo = getCurrentPathWithSearch(pathname, searchParams);

  const { user, isPending } = useAuth();

  useEffect(() => {
    if (isPending) return;

    if (!user?.id) {
      router.replace(createSignInUrl(returnTo));
      return;
    }

    router.replace(`/profile/${user.id}`);
  }, [returnTo, user?.id, isPending, router]);

  return null;
}
