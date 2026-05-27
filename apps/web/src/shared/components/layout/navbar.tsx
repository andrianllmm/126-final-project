'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { cn } from '@/shared/lib/utils';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/shared/components/ui/navigation-menu';

import { NavUser } from './nav-user';
import { ThemeToggle } from '../theme-toggle';

import { navItems } from './navbar.data';

import { Button } from '../ui/button';
import { Logo } from '@/shared/components/brand/logo';
import { Wordmark } from '@/shared/components/brand/wordmark';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { GlobalSearchBar } from '@/features/listings/components/search/global-search-bar';

import { PackageIcon } from 'lucide-react';
import { MessagingPopover } from '@/features/messaging/components/messaging-popover';
import { useAuth } from '@/features/auth/hooks/use-auth';

function NavMenuItem({
  title,
  href,
  description,
}: {
  title: string;
  href: string;
  description?: string;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="font-medium leading-none">{title}</div>
            {description && (
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function NavSectionItem({ section }: { section: (typeof navItems)[number] }) {
  const isSingle = section.items.length === 1;
  const singleItem = section.items[0];

  if (isSingle && singleItem) {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href={singleItem.href}>{singleItem.label}</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>

      <NavigationMenuContent>
        <ul className="w-96 p-2">
          {section.items.map((item) => (
            <NavMenuItem
              key={item.href}
              title={item.label}
              href={item.href}
              description={item.description}
            />
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

export function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const hideSearch = pathname.startsWith('/search');
  const { user, isPending } = useAuth();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={cn('relative z-50 w-full border-b bg-background', className)}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center">
          <Logo className="text-primary w-8 h-8 md:hidden" />
          <Wordmark className="text-primary hidden md:block h-8 w-auto" />
        </Link>

        {/* Nav */}
        <NavigationMenu className="mx-auto">
          <NavigationMenuList>
            {navItems.map((section) => (
              <NavSectionItem key={section.title} section={section} />
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1">
          {/* Global search */}
          {!hideSearch && (
            <div className="flex-1">
              <GlobalSearchBar className="max-w-xl" />
            </div>
          )}

          <ThemeToggle />

          {mounted && user && !isPending && (
            <>
              <Link href="/transactions">
                <Button variant="ghost" size="icon">
                  <PackageIcon />
                </Button>
              </Link>

              <MessagingPopover />

              <NotificationBell />
            </>
          )}

          <NavUser />
        </div>
      </div>
    </header>
  );
}
