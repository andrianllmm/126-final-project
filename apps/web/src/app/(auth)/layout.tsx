import Link from 'next/link';
import { Logo } from '@/shared/components/brand/logo';
import { Wordmark } from '@/shared/components/brand/wordmark';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="w-full">
        <div className="mx-auto flex h-24 max-w-6xl items-center justify-center px-4">
          <Link href="/" className="flex items-center">
            <Logo className="text-primary size-8 md:hidden" />
            <Wordmark className="text-primary hidden md:block h-8 w-auto" />
          </Link>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex items-center justify-center px-4">
        {children}
      </main>
    </div>
  );
}
