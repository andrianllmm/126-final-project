import { ProfileHeader } from '@/features/users/components/profile-header';

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <div>
      <ProfileHeader userId={userId} />
    </div>
  );
}
