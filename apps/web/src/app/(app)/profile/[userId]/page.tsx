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
    <div className="page-container py-8">
      <div className="space-y-4">
        <ProfileHeader userId={userId} />
        <Separator />
        <ProfileStats userId={userId} />
        <Separator />
        <ProfileTabs userId={userId} />
      </div>
    </div>
  );
}
