import { apiClient } from '@/shared/lib/api-client';
import { type Offer, type OfferList, type CreateOfferInput } from '@repo/api';

export const createOffer = (input: CreateOfferInput) =>
  apiClient.post<Offer, CreateOfferInput>('/offers', input);

export const getOffersByTransaction = (transactionId: string) =>
  apiClient.get<OfferList>(`/offers/transaction/${transactionId}`);

export const acceptOffer = (id: string) =>
  apiClient.patch<Offer, Record<string, never>>(`/offers/${id}/accept`, {});

export const rejectOffer = (id: string) =>
  apiClient.patch<Offer, Record<string, never>>(`/offers/${id}/reject`, {});
