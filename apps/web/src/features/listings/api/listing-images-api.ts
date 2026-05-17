import { apiClient } from '@/shared/lib/api-client';
import { type Listing } from '@repo/api';

export const addListingImages = (listingId: string, files: File[]) => {
  const form = new FormData();
  files.forEach((file) => form.append('images', file));

  return apiClient.post<Listing, FormData>(
    `/listings/${listingId}/images`,
    form,
  );
};

export const removeListingImage = (listingId: string, imageId: string) =>
  apiClient.delete<Listing>(`/listings/${listingId}/images/${imageId}`);

export const reorderListingImages = (
  listingId: string,
  orderedImageIds: string[],
) =>
  apiClient.patch<Listing, { orderedImageIds: string[] }>(
    `/listings/${listingId}/images/reorder`,
    {
      orderedImageIds,
    },
  );
