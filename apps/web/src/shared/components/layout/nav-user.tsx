'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MoonIcon, MonitorIcon, SunIcon, LogOutIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { authClient } from '@/shared/lib/auth-client';
import { disconnectSocket } from '@/shared/lib/socket-client';
import { useUserProfile } from '@/features/users/hooks/use-user-profile';
import {
  createSignInUrl,
  getCurrentPathWithSearch,
} from '@/shared/lib/auth-redirect';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { UserAvatar } from '@/features/users/components/user-avatar';

type Theme = 'light' | 'dark' | 'system';

export function NavUser({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const { user, isPending, refetch } = useAuth();
  const profileQuery = useUserProfile(user?.id ?? '');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    disconnectSocket();
    await authClient.signOut();
    refetch();
    router.replace('/sign-in');
    router.refresh();
  };

  const currentPath = getCurrentPathWithSearch(pathname, searchParams);

  if (isPending) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!user) {
    return (
      <Button asChild className={className}>
        <Link href={createSignInUrl(currentPath)} replace>
          Sign in
        </Link>
      </Button>
    );
  }

  const name = user.name ?? null;
  const email = user.email ?? null;
  const profile = profileQuery.data;
  const displayName = profile?.name ?? name;
  const displayEmail = profile?.email ?? email;
  const avatarUrl = profile?.image ?? null;
  const currentTheme: Theme =
    theme === 'light' || theme === 'dark' || theme === 'system'
      ? theme
      : 'system';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
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

        <DropdownMenuLabel>Appearance</DropdownMenuLabel>

        <DropdownMenuRadioGroup
          value={mounted ? currentTheme : 'system'}
          onValueChange={(value) => setTheme(value as Theme)}
        >
          <DropdownMenuRadioItem value="light">
            <SunIcon />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <MoonIcon />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <MonitorIcon />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
