'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface AuthRouteGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthRouteGuard({
  children,
  redirectTo = '/sign-in',
}: AuthRouteGuardProps) {
  const router = useRouter();
  const { user, isPending } = useAuth();

  useEffect(() => {
    if (isPending) return;

    if (!user?.id) {
      router.replace(redirectTo);
    }
  }, [isPending, redirectTo, router, user?.id]);

  if (isPending || !user?.id) {
    return null;
  }

  return children;
}
