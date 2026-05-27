import { z } from 'zod';
import { stringToDate } from '../codecs.js';
import { ReviewRoleSchema } from '../enums.js';

export const reviewAuthorSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  image: z.url().nullable(),
});

export const reviewSchema = z.object({
  id: z.string(),
  reviewerId: z.string(),
  revieweeId: z.string(),
  listingId: z.string(),
  transactionId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).nullable().optional(),
  role: ReviewRoleSchema,
  createdAt: stringToDate,
});

export const reviewListSchema = z.array(reviewSchema);

export const reviewWithAuthorSchema = reviewSchema.extend({
  reviewer: reviewAuthorSchema,
});

export const reviewWithAuthorListSchema = z.array(reviewWithAuthorSchema);

export const createReviewSchema = z.object({
  transactionId: z.string(),
  listingId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(500).optional(),
});

export type Review = z.infer<typeof reviewSchema>;
export type ReviewList = z.infer<typeof reviewListSchema>;
export type ReviewAuthor = z.infer<typeof reviewAuthorSchema>;
export type ReviewWithAuthor = z.infer<typeof reviewWithAuthorSchema>;
export type ReviewWithAuthorList = z.infer<typeof reviewWithAuthorListSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
