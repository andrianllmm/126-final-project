import { z } from 'zod';

const avatarUploadSchema = z.object({
  id: z.string(),
  url: z.string(),
});

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  avatarUpload: avatarUploadSchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const userProfileUpdateSchema = z.object({
  name: z.string().trim().min(1).nullable().optional(),
  avatarUploadId: z.string().nullable().optional(),
});

export const userProfileStatsSchema = z.object({
  averageRating: z.number(),
  reviewCount: z.number(),
  salesCount: z.number(),
  listingCount: z.number(),
  responseRate: z.number(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>;
export type UserProfileStats = z.infer<typeof userProfileStatsSchema>;
