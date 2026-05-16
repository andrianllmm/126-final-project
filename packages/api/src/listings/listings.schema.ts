import { z } from 'zod';
import { ListingConditionSchema, ListingStatusSchema } from '../enums.js';

export const updateListingStatusSchema = z.object({
  status: ListingStatusSchema,
});

export const createListingSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number().min(0),
  categoryId: z.string(),
  condition: ListingConditionSchema,
  meetupLocation: z.string().nullable().optional(),
  status: ListingStatusSchema.optional(),
  uploadIds: z
    .array(z.string())
    .refine((arr) => new Set(arr).size === arr.length, {
      message: 'Array must contain unique values',
    })
    .optional(),
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

export type UpdateListingStatusInput = z.infer<
  typeof updateListingStatusSchema
>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
