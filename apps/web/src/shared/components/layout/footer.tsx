import Link from 'next/link';

import { cn } from '@/shared/lib/utils';

import { Wordmark } from '../brand/wordmark';

import { footerLinks, footerMeta } from './footer.data';

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn('border-t bg-background', className)}>
      <div className="page-container py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div>
              <Wordmark className="max-w-42 text-primary" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="mt-2 text-xs text-muted-foreground">
                Buy and sell within UPV
              </p>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-medium">{group.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {footerMeta.year} {footerMeta.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
