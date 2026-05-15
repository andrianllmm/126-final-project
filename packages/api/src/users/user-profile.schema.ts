import { z } from 'zod';

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  image: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const userProfileStatsSchema = z.object({
  averageRating: z.number(),
  reviewCount: z.number(),
  salesCount: z.number(),
  listingCount: z.number(),
  responseRate: z.number(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserProfileStats = z.infer<typeof userProfileStatsSchema>;
