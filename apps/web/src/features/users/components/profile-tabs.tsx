'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { ListingGrid } from '@/features/listings/components/listing-grid';

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
        <div>Reviews of {userId}</div>
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
