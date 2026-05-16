import { z } from 'zod';
import { ListingConditionSchema, ListingStatusSchema } from '../enums.js';
import { stringToDate } from '../codecs.js';

export const listingImageSchema = z.object({
  id: z.string(),
  sortOrder: z.number(),
  upload: z.object({
    id: z.string(),
    url: z.url(),
  }),
});

export const listingSellerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
});

export const listingSchema = z.object({
  id: z.string(),

  title: z.string(),
  description: z.string(),
  price: z.number(),
  condition: ListingConditionSchema,
  status: ListingStatusSchema,

  meetupLocation: z.string().nullable(),

  category: z.any(),

  images: z.array(listingImageSchema),

  seller: listingSellerSchema,

  createdAt: stringToDate,
  updatedAt: stringToDate,

  soldAt: stringToDate.nullable().optional(),
});

export const listingListSchema = z.array(listingSchema);

export const createListingSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number().min(0),
  categoryId: z.string(),
  condition: ListingConditionSchema,
  meetupLocation: z.string().nullable().optional(),
  status: ListingStatusSchema.optional(),
});

export const updateListingSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  condition: ListingConditionSchema.optional(),
  meetupLocation: z.string().nullable().optional(),
  uploadIds: z
    .array(z.string())
    .refine((arr) => new Set(arr).size === arr.length, {
      message: 'Array must contain unique values',
    })
    .optional(),
  status: ListingStatusSchema.optional(),
});

export const updateListingStatusSchema = z.object({
  status: ListingStatusSchema,
});

export type ListingImage = z.infer<typeof listingImageSchema>;
export type ListingSeller = z.infer<typeof listingSellerSchema>;
export type Listing = z.infer<typeof listingSchema>;
export type ListingList = z.infer<typeof listingListSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type UpdateListingStatusInput = z.infer<
  typeof updateListingStatusSchema
>;
