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
  const { data: profile, isLoading, error } = useUserProfile(userId);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-4 py-8">
        <p className="text-lg font-semibold">Profile unavailable</p>
        <p className="text-sm text-muted-foreground">
          {error?.message ?? 'Unable to load your profile.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs value={tab} onValueChange={setTab} className="w-full space-y-4">
        <TabsList variant="line">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSettingsForm profile={profile} />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileSettingsForm profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
