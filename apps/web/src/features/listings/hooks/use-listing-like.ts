'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  createSignInUrl,
  getCurrentPathWithSearch,
} from '@/shared/lib/auth-redirect';

import { likeListing, unlikeListing } from '../api/listings-api';

type ListingLikeState = {
  isLikedByUser: boolean;
  likeCount: number;
};

export function useListingLikeState({
  listingId,
  initialLikeCount,
  initialIsLikedByUser,
}: {
  listingId: string;
  initialLikeCount: number;
  initialIsLikedByUser: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const currentPath = getCurrentPathWithSearch(pathname, searchParams);

  const [state, setState] = useState<ListingLikeState>({
    isLikedByUser: initialIsLikedByUser,
    likeCount: initialLikeCount,
  });
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const nextState = {
      isLikedByUser: initialIsLikedByUser,
      likeCount: initialLikeCount,
    };

    setState(nextState);
    stateRef.current = nextState;
  }, [initialIsLikedByUser, initialLikeCount, listingId]);

  const mutation = useMutation({
    mutationFn: (nextLiked: boolean) =>
      nextLiked ? likeListing(listingId) : unlikeListing(listingId),
    onMutate: async (nextLiked) => {
      const snapshot = stateRef.current;
      const nextCount = Math.max(snapshot.likeCount + (nextLiked ? 1 : -1), 0);
      const nextState = {
        isLikedByUser: nextLiked,
        likeCount: nextCount,
      };

      setState(nextState);
      stateRef.current = nextState;

      return { snapshot };
    },
    onError: (_, nextLiked, context) => {
      if (context?.snapshot) {
        setState(context.snapshot);
        stateRef.current = context.snapshot;
      }

      toast.error(
        nextLiked ? 'Could not like listing' : 'Could not unlike listing',
      );
    },
    onSuccess: (updatedListing) => {
      const nextState = {
        isLikedByUser: updatedListing.isLikedByUser,
        likeCount: updatedListing.likeCount,
      };

      setState(nextState);
      stateRef.current = nextState;

      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({
        queryKey: ['users', 'me', 'liked-listings'],
      });
    },
  });

  const toggleLike = () => {
    if (!user) {
      toast.error('Please sign in to like listings');
      router.replace(createSignInUrl(currentPath));
      return;
    }

    mutation.mutate(!stateRef.current.isLikedByUser);
  };

  return {
    likeCount: state.likeCount,
    isLikedByUser: state.isLikedByUser,
    isPending: mutation.isPending,
    toggleLike,
  };
}
