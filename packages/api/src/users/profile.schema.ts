import { z } from 'zod';
import { stringToDate } from '../codecs.js';

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string().trim().nullable(),
  email: z.email(),
  emailVerified: z.boolean(),
  phoneNumber: z.e164().nullable(),
  image: z.url().nullable(),
  bio: z.string().nullable(),
  createdAt: stringToDate,
  updatedAt: stringToDate,
});

export const userProfileUpdateSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').optional(),
  bio: z
    .string()
    .trim()
    .min(4, 'Bio is too short')
    .max(300, 'Bio is too long')
    .optional(),
});

export const userProfileStatsSchema = z.object({
  averageRating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  salesCount: z.number().int().nonnegative(),
  listingCount: z.number().int().nonnegative(),
  responseRate: z.number().min(0).max(1),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>;
export type UserProfileStats = z.infer<typeof userProfileStatsSchema>;
