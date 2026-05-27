'use client';

import { Heart } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

import { useListingLikeState } from '../hooks/use-listing-like';

export function ListingLikeButton({
  listingId,
  likeCount,
  isLikedByUser,
  className,
}: {
  listingId: string;
  likeCount: number;
  isLikedByUser: boolean;
  className?: string;
}) {
  const {
    likeCount: currentLikeCount,
    isLikedByUser: currentIsLikedByUser,
    isPending,
    toggleLike,
  } = useListingLikeState({
    listingId,
    initialLikeCount: likeCount,
    initialIsLikedByUser: isLikedByUser,
  });

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        'gap-1 text-muted-foreground hover:text-foreground',
        currentIsLikedByUser && 'text-primary hover:text-primary',
        className,
      )}
      aria-pressed={currentIsLikedByUser}
      onClick={(event) => {
        event.stopPropagation();
        toggleLike();
      }}
      disabled={isPending}
    >
      <Heart className={cn('size-4', currentIsLikedByUser && 'fill-current')} />
      <span>{currentLikeCount}</span>
      <span className="sr-only">
        {currentIsLikedByUser ? 'Unlike listing' : 'Like listing'}
      </span>
    </Button>
  );
}
