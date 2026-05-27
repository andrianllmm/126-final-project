'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ArrowLeft, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/features/auth/hooks/use-session';
import { useTransaction } from '@/features/transactions/hooks/use-transaction';

import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Spinner } from '@/shared/components/ui/spinner';
import { cn } from '@/shared/lib/utils';

export default function TransactionReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user ?? null;

  const { data: transaction, isLoading } = useTransaction(params?.id ?? '');

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const activeRating = hoveredRating ?? rating;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.info('Review submission is not wired up yet.');
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <main className="page-container flex min-h-screen items-center justify-center">
        <Spinner className="size-7 text-primary" />
      </main>
    );
  }

  return (
    <main className="page-container py-12">
      <div className="mx-auto max-w-xl space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            How did it go?
          </h1>
          <p className="text-muted-foreground">
            Your honest feedback helps build trust in the community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="space-y-1">
              <Label className="text-base font-medium">Your rating</Label>
              <p className="text-xs text-muted-foreground">
                Tap a star to set your rating.
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className="rounded-full p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(null)}
                  aria-label={`Rate ${value} star${value === 1 ? '' : 's'}`}
                >
                  <Star
                    className={cn(
                      'size-9 transition-colors duration-100',
                      value <= activeRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-transparent text-muted-foreground/25',
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Label
                  htmlFor="review-comment"
                  className="text-base font-medium"
                >
                  Share the details
                </Label>
                <p className="text-xs text-muted-foreground">
                  What went well? Anything to watch out for?
                </p>
              </div>
              <MessageSquare className="size-5 text-muted-foreground/40" />
            </div>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Great communication, fast shipping, item was exactly as described..."
              className="min-h-44 resize-y text-sm leading-relaxed"
            />
            {comment.length > 0 && (
              <p className="text-right text-xs text-muted-foreground">
                {comment.length} characters
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <Button type="submit" size="lg" className="min-w-36">
              Submit review
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
