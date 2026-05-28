'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/use-auth';

import {
  createSignInUrl,
  getCurrentPathWithSearch,
} from '@/shared/lib/auth-redirect';

interface AuthRouteGuardProps {
  children: React.ReactNode;
}

export function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isPending } = useAuth();
  const returnTo = getCurrentPathWithSearch(pathname, searchParams);

  useEffect(() => {
    if (isPending) return;

    if (!user?.id) {
      router.replace(createSignInUrl(returnTo));
    }
  }, [isPending, returnTo, router, user?.id]);

  if (isPending || !user?.id) {
    return null;
  }

  return children;
}
