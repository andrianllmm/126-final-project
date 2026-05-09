import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/shared/components/ui/navigation-menu';

import { AuthButton } from '@/auth/components/auth-button';

import { Logo } from '@/shared/components/brand/logo';
import { Wordmark } from '@/shared/components/brand/wordmark';

/**
 * Types (explicit + minimal)
 */
type NavItem = {
  label: string;
  href: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

/**
 * Optional navItems (safe fallback)
 */
const navItems: NavSection[] | undefined = [];

export function Navbar() {
  return (
    <header className="w-full border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center">
          <Logo className="text-primary w-8 h-8 md:hidden" />
          <Wordmark className="text-primary hidden md:block h-8 w-auto" />
        </Link>

        {/* Nav */}
        <NavigationMenu>
          <NavigationMenuList>
            {(navItems ?? []).map((section) => (
              <NavigationMenuItem key={section.title}>
                {section.items.length > 1 ? (
                  <>
                    <NavigationMenuTrigger>
                      {section.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-48 gap-1 p-2">
                        {section.items.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className="block rounded px-2 py-1 text-sm hover:bg-accent"
                              >
                                {item.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  section.items?.[0] && (
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link href={section.items[0].href}>
                        {section.items[0].label}
                      </Link>
                    </NavigationMenuLink>
                  )
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth */}
        <AuthButton />
      </div>
    </header>
  );
}
