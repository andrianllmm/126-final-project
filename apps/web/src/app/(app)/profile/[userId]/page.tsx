import { ProfileHeader } from '@/features/users/components/profile-header';
import { ProfileStats } from '@/features/users/components/profile-stats';
import { ProfileTabs } from '@/features/users/components/profile-tabs';
import { Separator } from '@/shared/components/ui/separator';

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <div className="mx-auto max-w-6xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-4">
      <ProfileHeader userId={userId} />
      <Separator />
      <ProfileStats userId={userId} />
      <Separator />
      <ProfileTabs userId={userId} />
    </div>
  );
}
