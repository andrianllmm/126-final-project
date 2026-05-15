'use client';

import Link from 'next/link';

import { ShareDialog } from '@/shared/components/share-dialog';
import { useUserProfile } from '../hooks/use-user-profile';
import { authClient } from '@/shared/lib/auth-client';

import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { UserAvatar } from './user-avatar';

export function ProfileHeader({ userId }: { userId: string }) {
  const { data, isLoading, error } = useUserProfile(userId);
  const session = authClient.useSession();

  const currentUserId = session.data?.user?.id;
  const isOwner = currentUserId === userId;

  if (isLoading) return <ProfileHeaderLoading />;
  if (error) return <ProfileHeaderError message={error.message} />;
  if (!data) return <ProfileHeaderError message="Profile not found" />;

  const createdAt = new Date(data.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full px-6 py-10">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <UserAvatar
            name={data.name}
            email={data.email}
            src={data.avatarUpload?.url ?? null}
            sizeClassName="size-32"
            fallbackClassName="text-4xl font-semibold"
          />

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              {data.name ?? 'Unnamed user'}
            </h1>

            <p className="text-muted-foreground">{data.email}</p>

            <p className="text-sm text-muted-foreground">
              Member since {createdAt}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {isOwner && (
            <Button variant="outline" size="lg" className="min-w-28" asChild>
              <Link href="/settings?tab=profile">Edit profile</Link>
            </Button>
          )}

          <ShareDialog url={`/users/${userId}`}>
            <Button size="lg" className="min-w-28">
              Share
            </Button>
          </ShareDialog>
        </div>
      </div>
    </div>
  );
}

function ProfileHeaderLoading() {
  return (
    <div className="w-full border-b px-6 py-10">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Skeleton className="size-32 rounded-full" />

          <div className="space-y-3">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-11 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function ProfileHeaderError({ message }: { message: string }) {
  return (
    <div className="border-b px-6 py-10">
      <p className="text-lg font-semibold">Profile unavailable</p>

      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
