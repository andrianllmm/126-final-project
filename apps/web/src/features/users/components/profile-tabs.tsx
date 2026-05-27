'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { ListingGrid } from '@/features/listings/components/listing-grid';
import { RatingCard } from '@/features/reviews/components/rating-card';
import { useUserReviews } from '@/features/reviews/hooks/use-user-reviews';
import { Spinner } from '@/shared/components/ui/spinner';

import type { ReviewWithAuthor } from '@repo/api';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';

import { useMyLikedListings } from '../hooks/use-user-profile';

export function ProfileTabs({ userId }: { userId: string }) {
  const { user, isPending } = useAuth();
  const isOwner = user?.id === userId;
  const { data: likedListings, isLoading: likedListingsLoading } =
    useMyLikedListings(isOwner && !isPending);
  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useUserReviews(userId);

  return (
    <Tabs defaultValue="listings" className="w-full">
      <TabsList variant="line">
        <TabsTrigger value="listings">Listings</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        {isOwner && !isPending ? (
          <TabsTrigger value="liked">Liked Listings</TabsTrigger>
        ) : null}
      </TabsList>
      <TabsContent value="listings">
        <div>Listings of {userId}</div>
      </TabsContent>
      <TabsContent value="reviews">
        {reviewsLoading ? (
          <div className="flex justify-center py-10">
            <Spinner className="size-6 text-primary" />
          </div>
        ) : reviewsError ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Unable to load ratings.
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-4 py-2">
            {reviews.map((review: ReviewWithAuthor) => (
              <RatingCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No ratings yet.
          </div>
        )}
      </TabsContent>
      {isOwner ? (
        <TabsContent value="liked">
          <ListingGrid
            listings={likedListings}
            isLoading={likedListingsLoading}
          />
        </TabsContent>
      ) : null}
    </Tabs>
  );
}
