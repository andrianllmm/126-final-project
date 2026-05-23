'use client';

import Link from 'next/link';

import { ShareDialog } from '@/shared/components/share-dialog';
import { useUserProfile } from '../hooks/use-user-profile';
import { useAuth } from '@/features/auth/hooks/use-auth';

import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { UserAvatar } from './user-avatar';
import { VerifiedBadge } from './user-verified-badge';

import { Mail, Phone } from 'lucide-react';

export function ProfileHeader({ userId }: { userId: string }) {
  const { data, isLoading, error } = useUserProfile(userId);
  const { user, isPending: authLoading } = useAuth();

  const currentUserId = user?.id;
  const isOwner = currentUserId === userId;

  const showLoading = (authLoading && !data) || (isLoading && !data);

  if (showLoading) return <ProfileHeaderLoading />;
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
            src={data.image ?? null}
            sizeClassName="size-32"
            fallbackClassName="text-4xl font-semibold"
          />

          <div className="space-y-2">
            <h1 className="flex items-center gap-1 text-3xl font-bold">
              {data.name ?? 'Unnamed user'}
              {data.emailVerified && <VerifiedBadge />}
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              {data.email && (
                <div className="flex items-center gap-1">
                  <Mail className="size-4 text-muted-foreground" />

                  <a
                    href={`mailto:${data.email}`}
                    className="text-muted-foreground hover:underline"
                  >
                    {data.email}
                  </a>
                </div>
              )}

              {data.phoneNumber && (
                <div className="flex items-center gap-1">
                  <Phone className="size-4 text-muted-foreground" />

                  <a
                    href={`tel:${data.phoneNumber}`}
                    className="text-muted-foreground hover:underline"
                  >
                    {data.phoneNumber}
                  </a>
                </div>
              )}
            </div>

            {data.bio && (
              <p className="text-sm leading-relaxed max-w-xl">{data.bio}</p>
            )}

            <p className="text-xs text-muted-foreground">
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
