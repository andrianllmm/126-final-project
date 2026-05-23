import { z } from 'zod';
import { ListingStatusSchema, TransactionStatusSchema } from '../enums.js';
import { stringToDate } from '../codecs.js';

export const transactionListingSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  status: ListingStatusSchema,
  images: z.array(
    z.object({
      id: z.string(),
      upload: z.object({
        id: z.string(),
        url: z.url(),
      }),
    }),
  ),
});

export const transactionUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
});

export const transactionSchema = z.object({
  transactionId: z.string(),
  listingId: z.string(),
  buyerId: z.string(),
  sellerId: z.string(),
  agreedPrice: z.number(),
  status: TransactionStatusSchema,
  createdAt: stringToDate,
  completedAt: stringToDate.nullable().optional(),
  listing: transactionListingSchema,
  buyer: transactionUserSchema,
  seller: transactionUserSchema,
});

export const transactionListSchema = z.array(transactionSchema);

export const paginatedTransactionsSchema = z.object({
  data: transactionListSchema,

  meta: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    hasMore: z.boolean(),
  }),
});

export const createTransactionSchema = z.object({
  listingId: z.string(),
});

export const updateTransactionStatusSchema = z.object({
  status: TransactionStatusSchema,
});

export const transactionQuerySchema = z.object({
  status: TransactionStatusSchema.optional(),
  role: z.enum(['buyer', 'seller', 'all']).optional(),
  listingId: z.string().optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
  sortBy: z.enum(['createdAt', 'completedAt', 'agreedPrice']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const acceptTransactionResponseSchema = z.object({
  transaction: transactionSchema,
  message: z.string(),
});

export const rejectTransactionResponseSchema = z.object({
  transaction: transactionSchema,
  message: z.string(),
});

export const completeTransactionResponseSchema = z.object({
  transaction: transactionSchema,
  message: z.string(),
  reviewPrompt: z.boolean(),
});

export const cancelTransactionSchema = z.object({
  reason: z.string().max(500).optional(),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionList = z.infer<typeof transactionListSchema>;
export type PaginatedTransactions = z.infer<typeof paginatedTransactionsSchema>;
export type TransactionListing = z.infer<typeof transactionListingSchema>;
export type TransactionUser = z.infer<typeof transactionUserSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionStatusInput = z.infer<
  typeof updateTransactionStatusSchema
>;
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;
export type AcceptTransactionResponse = z.infer<
  typeof acceptTransactionResponseSchema
>;
export type RejectTransactionResponse = z.infer<
  typeof rejectTransactionResponseSchema
>;
export type CompleteTransactionResponse = z.infer<
  typeof completeTransactionResponseSchema
>;
export type CancelTransactionInput = z.infer<typeof cancelTransactionSchema>;

// Actions
export type TransactionAction = 'accept' | 'reject' | 'complete' | 'cancel';
