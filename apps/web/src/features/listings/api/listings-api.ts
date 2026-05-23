import { apiClient } from '@/shared/lib/api-client';
import {
  type Listing,
  type ListingList,
  type CreateListingInput,
  type UpdateListingInput,
  type UpdateListingStatusInput,
  type TransactionStatus,
  type TransactionList,
} from '@repo/api';

export const getListings = () => apiClient.get<ListingList>('/listings');

export const getListing = (id: string) =>
  apiClient.get<Listing>(`/listings/${id}`);

export const createListing = (input: CreateListingInput) =>
  apiClient.post<Listing, CreateListingInput>('/listings', input);

export const updateListing = (id: string, input: UpdateListingInput) =>
  apiClient.patch<Listing, UpdateListingInput>(`/listings/${id}`, input);

export const updateListingStatus = (
  id: string,
  input: UpdateListingStatusInput,
) =>
  apiClient.patch<Listing, UpdateListingStatusInput>(
    `/listings/${id}/status`,
    input,
  );

export const deleteListing = (id: string) =>
  apiClient.delete<Listing>(`/listings/${id}`);

export const getListingById = (id: string) => getListing(id);
export const getListingTransactions = (
  listingId: string,
  status?: TransactionStatus | TransactionStatus[],
) =>
  apiClient.get<TransactionList>(`/listings/${listingId}/transactions`, {
    params: status ? { status } : undefined,
  });
