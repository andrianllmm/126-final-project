'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/features/users/hooks/use-user-profile';
import { OnboardingProfileForm } from '@/features/users/components/onboarding-profile-form';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isPending: authLoading } = useAuth();

  const userId = user?.id;

  const { data: profile, isLoading: profileLoading } = useUserProfile(
    userId ?? '',
  );

  const isLoading = authLoading || !userId || profileLoading;

  const isOnboarded = Boolean(profile?.name && profile?.image && profile?.bio);

  useEffect(() => {
    if (!isLoading && isOnboarded) {
      router.replace('/');
    }
  }, [isLoading, isOnboarded, router]);

  if (isLoading || !profile) return null;

  if (isOnboarded) return null;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <OnboardingProfileForm
          profile={profile}
          onComplete={() => router.push('/')}
          onSkip={() => router.push('/')}
        />
      </div>
    </div>
  );
}
