'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PackageIcon, PlusIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import { Button } from '@/shared/components/ui/button';
import { Logo } from '@/shared/components/brand/logo';
import { Wordmark } from '@/shared/components/brand/wordmark';

import { NavUser } from './nav-user';

import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { MessagingPopover } from '@/features/messaging/components/messaging-popover';
import { GlobalSearchBar } from '@/features/listings/components/search/global-search-bar';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const hideSearch = pathname.startsWith('/search');

  const { user, isPending } = useAuth();

  const isAuthed = useMemo(
    () => Boolean(user && !isPending),
    [user, isPending],
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className={cn('w-full border-b bg-background z-50', className)}>
      <div className="page-container">
        <div className="flex h-16 items-center justify-backdrop gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Logo className="h-8 w-8 md:hidden" />
            <Wordmark className="text-primary hidden h-8 md:block" />
          </Link>

          {/* Search */}
          {!hideSearch && (
            <div className="flex-1 min-w-0 max-w-xl mx-auto">
              <GlobalSearchBar />
            </div>
          )}

          {/* Actions */}
          <div className="ml-auto flex items-center gap-0.5 md:gap-1 shrink-0">
            {mounted && isAuthed && (
              <>
                <Link href="/transactions">
                  <Button variant="ghost" size="icon-sm">
                    <PackageIcon />
                  </Button>
                </Link>

                <MessagingPopover />

                <NotificationBell />

                <Link href="/listings/new">
                  <Button size="icon-sm" className="aspect-square rounded-full">
                    <PlusIcon />
                  </Button>
                </Link>
              </>
            )}

            <NavUser className="ml-1" />
          </div>
        </div>
      </div>
    </header>
  );
}
