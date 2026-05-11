import { Wordmark } from '@/shared/components/brand/wordmark';
import { Spinner } from '@/shared/components/ui/spinner';

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-12">
        <Wordmark className="max-w-64 text-primary" />

        <div className="flex flex-col items-center gap-1">
          <Spinner className="size-8 text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
}
