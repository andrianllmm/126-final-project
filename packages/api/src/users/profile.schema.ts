import { z } from 'zod';

const avatarUploadSchema = z.object({
  id: z.string(),
  url: z.url(),
});

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string().trim().nullable(),
  email: z.email(),
  avatarUpload: avatarUploadSchema.nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const userProfileUpdateSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').optional(),
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
