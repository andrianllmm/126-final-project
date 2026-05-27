'use client';

import { formatDistanceToNow } from 'date-fns';
import { Star } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';

import type { ReviewWithAuthor } from '@repo/api';

type Props = {
  review: ReviewWithAuthor;
};

function getInitials(name: string | null | undefined) {
  if (!name) return 'U';

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function getRoleLabel(role: ReviewWithAuthor['role']) {
  return role === 'BUYER_TO_SELLER' ? 'From buyer' : 'From seller';
}

export function RatingCard({ review }: Props) {
  const reviewerName = review.reviewer.name ?? 'Anonymous user';
  const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
  });

  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <Avatar size="sm" className="size-10 shrink-0">
          <AvatarImage
            src={review.reviewer.image ?? undefined}
            alt={reviewerName}
          />
          <AvatarFallback>{getInitials(review.reviewer.name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="space-y-1">
              <h3 className="font-medium leading-none">{reviewerName}</h3>
              <p className="text-xs text-muted-foreground">
                {getRoleLabel(review.role)} · {timeAgo}
              </p>
            </div>

            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  className={cn(
                    'size-4',
                    value <= review.rating
                      ? 'fill-primary text-primary'
                      : 'fill-transparent text-muted-foreground/25',
                  )}
                />
              ))}
            </div>
          </div>

          {review.comment ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {review.comment}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground/70">
              No written comment.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
