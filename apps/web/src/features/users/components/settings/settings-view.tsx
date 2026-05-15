'use client';

import { useUserProfile } from '@/features/users/hooks/use-user-profile';
import { ProfileSettingsForm } from '@/features/users/components/settings/profile-settings-form';
import { Spinner } from '@/shared/components/ui/spinner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { AccountSettingsForm } from './account-settings-form';

type SettingsViewProps = {
  userId: string;
};

export function SettingsView({ userId }: SettingsViewProps) {
  const profileQuery = useUserProfile(userId);

  if (profileQuery.isLoading) {
    return (
      <div className="mx-auto max-w-6xl w-full px-4 py-8 sm:px-6 lg:px-8">
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
    <div className="mx-auto max-w-6xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="profile" className="w-full space-y-4">
        <TabsList variant="line">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettingsForm userId={userId} profile={profileQuery.data} />
        </TabsContent>

        <TabsContent value="account">
          <AccountSettingsForm userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
