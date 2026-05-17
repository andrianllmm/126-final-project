import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addListingImages,
  removeListingImage,
  reorderListingImages,
} from '../api/listing-images-api';

export function useAddListingImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, files }: { listingId: string; files: File[] }) =>
      addListingImages(listingId, files),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['listings', variables.listingId],
      });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useRemoveListingImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      listingId,
      imageId,
    }: {
      listingId: string;
      imageId: string;
    }) => removeListingImage(listingId, imageId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['listings', variables.listingId],
      });
    },
  });
}

export function useReorderListingImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      listingId,
      orderedImageIds,
    }: {
      listingId: string;
      orderedImageIds: string[];
    }) => reorderListingImages(listingId, orderedImageIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['listings', variables.listingId],
      });
    },
  });
}
