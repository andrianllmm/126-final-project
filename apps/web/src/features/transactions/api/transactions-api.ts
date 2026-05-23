import { apiClient } from '@/shared/lib/api-client';
import {
  type Transaction,
  type CreateTransactionInput,
  type TransactionQueryInput,
  PaginatedTransactions,
} from '@repo/api';

export const createTransaction = (input: CreateTransactionInput) =>
  apiClient.post<Transaction, CreateTransactionInput>('/transactions', input);

export const acceptTransaction = (id: string) =>
  apiClient.patch<Transaction, Record<string, never>>(
    `/transactions/${id}/accept`,
    {},
  );

export const rejectTransaction = (id: string) =>
  apiClient.patch<Transaction, Record<string, never>>(
    `/transactions/${id}/reject`,
    {},
  );

export const completeTransaction = (id: string) =>
  apiClient.patch<Transaction, Record<string, never>>(
    `/transactions/${id}/complete`,
    {},
  );

export const cancelTransaction = (id: string) =>
  apiClient.patch<Transaction, Record<string, never>>(
    `/transactions/${id}/cancel`,
    {},
  );

export const getUserTransactions = (query?: TransactionQueryInput) =>
  apiClient.get<PaginatedTransactions>('/transactions', {
    params: query,
  });

export const getTransaction = (id: string) =>
  apiClient.get<Transaction>(`/transactions/${id}`);
