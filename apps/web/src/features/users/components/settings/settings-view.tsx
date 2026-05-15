'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import { useUserProfile } from '@/features/users/hooks/use-user-profile';

import { AccountSettingsForm } from './account-settings-form';
import { ProfileSettingsForm } from '@/features/users/components/settings/profile-settings-form';

import { Spinner } from '@/shared/components/ui/spinner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';

type SettingsViewProps = {
  userId: string;
};

export function SettingsView({ userId }: SettingsViewProps) {
  const profileQuery = useUserProfile(userId);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = searchParams.get('tab') ?? 'account';

  const setTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

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

      <Tabs value={tab} onValueChange={setTab} className="w-full space-y-4">
        <TabsList variant="line">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSettingsForm userId={userId} />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileSettingsForm userId={userId} profile={profileQuery.data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
