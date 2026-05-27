'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pattern } from '@/features/listings/components/listing-stepper';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function Page() {
  const router = useRouter();
  const { user, isPending } = useAuth();

  useEffect(() => {
    if (isPending) return;

    if (!user?.id) {
      router.replace('/sign-in');
    }
  }, [isPending, router, user?.id]);

  if (isPending || !user?.id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <Pattern />
    </div>
  );
}
