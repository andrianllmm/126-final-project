import { z } from 'zod';

export const ListingConditionSchema = z.enum([
  'NEW',
  'LIKE_NEW',
  'GOOD',
  'FAIR',
  'FOR_PARTS',
]);

export type ListingCondition = z.infer<typeof ListingConditionSchema>;
export const ListingCondition = ListingConditionSchema.enum;

export const ListingStatusSchema = z.enum([
  'DRAFT',
  'AVAILABLE',
  'RESERVED',
  'SOLD',
  'ARCHIVED',
]);

export type ListingStatus = z.infer<typeof ListingStatusSchema>;
export const ListingStatus = ListingStatusSchema.enum;

export const TransactionStatusSchema = z.enum([
  'PENDING',
  'ACCEPTED',
  'REJECTED',
  'COMPLETED',
  'CANCELLED',
]);

export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;
export const TransactionStatus = TransactionStatusSchema.enum;

export const ReviewRoleSchema = z.enum(['BUYER_TO_SELLER', 'SELLER_TO_BUYER']);

export type ReviewRole = z.infer<typeof ReviewRoleSchema>;
export const ReviewRole = ReviewRoleSchema.enum;

export const NotificationTypeSchema = z.enum([
  'MESSAGE',
  'TRANSACTION',
  'SYSTEM',
  'RATING',
]);

export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export const NotificationType = NotificationTypeSchema.enum;
