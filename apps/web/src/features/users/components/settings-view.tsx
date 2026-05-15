'use client';

import { useUserProfile } from '@/features/users/hooks/use-user-profile';
import { ProfileSettingsForm } from '@/features/users/components/profile-settings-form';
import { Spinner } from '@/shared/components/ui/spinner';

type SettingsViewProps = {
  userId: string;
};

export function SettingsView({ userId }: SettingsViewProps) {
  const profileQuery = useUserProfile(userId);

  if (profileQuery.isLoading) {
    return (
      <div className="mx-auto max-w-6xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      </div>
    );
  }

  if (profileQuery.error || !profileQuery.data) {
    return (
      <div className="mx-auto max-w-6xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-4">
        <p className="text-lg font-semibold">Profile unavailable</p>
        <p className="text-sm text-muted-foreground">
          {profileQuery.error?.message ?? 'Unable to load your profile.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-4">
      <h1 className="text-3xl font-bold">Settings</h1>

      <ProfileSettingsForm userId={userId} profile={profileQuery.data} />
    </div>
  );
}
