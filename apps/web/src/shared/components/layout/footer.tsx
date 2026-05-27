import Link from 'next/link';

import { cn } from '@/shared/lib/utils';

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn('border-t bg-background', className)}>
      <div className="page-container py-4 flex items-center justify-between text-xs text-muted-foreground">
        <p>Iskommerce © {new Date().getFullYear()}</p>

        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
