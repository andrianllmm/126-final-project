'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>

        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
