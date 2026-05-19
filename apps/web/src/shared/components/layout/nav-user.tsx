'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { authClient } from '@/shared/lib/auth-client';
import { disconnectSocket } from '@/shared/lib/socket-client';
import { useUserProfile } from '@/features/users/hooks/use-user-profile';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { LogOutIcon } from 'lucide-react';
import { UserAvatar } from '@/features/users/components/user-avatar';

export function NavUser() {
  const router = useRouter();

  const session = authClient.useSession();
  const user = session.data?.user;
  const profileQuery = useUserProfile(user?.id ?? '');

  const handleLogout = async () => {
    disconnectSocket();
    await authClient.signOut();
    session.refetch();
    router.push('/sign-in');
    router.refresh();
  };

  if (session.isPending) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!user) {
    return (
      <Button asChild>
        <Link href="/sign-in">Sign in</Link>
      </Button>
    );
  }

  const name = user.name ?? null;
  const email = user.email ?? null;
  const profile = profileQuery.data;
  const displayName = profile?.name ?? name;
  const displayEmail = profile?.email ?? email;
  const avatarUrl = profile?.avatarUpload?.url ?? null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center rounded-full focus:outline-none">
          <UserAvatar name={displayName} email={displayEmail} src={avatarUrl} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium leading-none">
            {displayName ?? 'User'}
          </span>
          <span className="text-xs text-muted-foreground">{displayEmail}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/me">Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings">Account</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
