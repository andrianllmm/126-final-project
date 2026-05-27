import { apiClient } from '@/shared/lib/api-client';
import {
  type Listing,
  type ListingPage,
  type ListingPaginationQuery,
  type CreateListingInput,
  type UpdateListingInput,
  type UpdateListingStatusInput,
  type TransactionStatus,
  type TransactionList,
  ListingCategoryList,
} from '@repo/api';

export const getListings = (query: ListingPaginationQuery) =>
  apiClient.get<ListingPage>('/listings', {
    params: query,
  });

export const getListing = (id: string) =>
  apiClient.get<Listing>(`/listings/${id}`);

export const likeListing = (id: string) =>
  apiClient.post<Listing>(`/listings/${id}/like`, undefined);

export const unlikeListing = (id: string) =>
  apiClient.delete<Listing>(`/listings/${id}/like`);

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

export const getCategories = () =>
  apiClient.get<ListingCategoryList>('/listings/categories');
