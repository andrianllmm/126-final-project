'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import {
  createSignInUrl,
  getCurrentPathWithSearch,
} from '@/shared/lib/auth-redirect';

function formatError(error: string | null) {
  if (!error) return 'An unexpected authentication error occurred.';

  return decodeURIComponent(error)
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const currentPath = getCurrentPathWithSearch('/auth/error', searchParams);

  return (
    <div className="w-full max-w-md text-center space-y-6">
      <div className="flex justify-center">
        <AlertCircle className="w-10 h-10 text-destructive" />
      </div>

      <h1 className="text-xl font-semibold">Authentication Error</h1>

      <p>{formatError(error)}</p>

      <div className="flex gap-2 justify-center">
        <Button asChild variant="default">
          <Link href={createSignInUrl(currentPath)} replace>
            Back to sign in
          </Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
