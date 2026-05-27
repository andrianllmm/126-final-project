'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, MessageSquare, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Spinner } from '@/shared/components/ui/spinner';
import { cn } from '@/shared/lib/utils';

import type { Review } from '@repo/api';
import { useCreateReviewMutation } from '../hooks/use-create-review';

type Props = {
  transactionId: string;
  listingId: string;
  targetName: string;
  title: string;
  description: string;
  existingReview?: Review | null;
  backHref?: string;
};

export function ReviewForm({
  transactionId,
  listingId,
  targetName,
  title,
  description,
  existingReview,
  backHref = '/transactions',
}: Props) {
  const router = useRouter();
  const createReviewMutation = useCreateReviewMutation();
  const isReadOnly = Boolean(existingReview);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  useEffect(() => {
    if (!existingReview) return;

    setRating(existingReview.rating);
    setComment(existingReview.comment ?? '');
    setHoveredRating(null);
  }, [existingReview]);

  const activeRating = hoveredRating ?? rating;

  const submitLabel = useMemo(() => {
    if (isReadOnly) return 'Reviewed';
    return createReviewMutation.isPending ? 'Submitting...' : 'Submit review';
  }, [createReviewMutation.isPending, isReadOnly]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isReadOnly) return;

    createReviewMutation.mutate(
      {
        transactionId,
        listingId,
        rating,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Review submitted');
          router.push(`/transactions/${transactionId}`);
        },
        onError: (error) => {
          console.error(error);
          toast.error('Failed to submit review');
        },
      },
    );
  };

  return (
    <main className="page-container py-12">
      <div className="mx-auto max-w-xl space-y-8">
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">{targetName}</p>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="space-y-1">
              <Label className="text-base font-medium">Your rating</Label>
              <p className="text-xs text-muted-foreground">
                {isReadOnly
                  ? 'Your submitted rating.'
                  : 'Tap a star to set your rating.'}
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
                  disabled={isReadOnly}
                  aria-label={`Rate ${value} star${value === 1 ? '' : 's'}`}
                >
                  <Star
                    className={cn(
                      'size-9 transition-colors duration-100',
                      value <= activeRating
                        ? 'fill-primary text-primary'
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
              disabled={isReadOnly}
              maxLength={500}
            />
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(backHref)}
              className="gap-1.5 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Button
              type="submit"
              size="lg"
              className="min-w-36"
              disabled={isReadOnly || createReviewMutation.isPending}
            >
              {isReadOnly ? (
                'Reviewed'
              ) : createReviewMutation.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="size-4" />
                  Submitting...
                </span>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
