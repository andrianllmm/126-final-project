import { z } from 'zod';
import { ListingConditionSchema, ListingStatusSchema } from '../enums.js';
import { stringToDate } from '../codecs.js';

export const listingCategorySchema = z.object({
  id: z.string(),
  categoryName: z.string(),
  slug: z.string(),
});

export const listingSearchSortBySchema = z.enum([
  'createdAt',
  'price',
  'title',
  'category',
  'condition',
]);

export const listingSearchSortOrderSchema = z.enum(['asc', 'desc']);

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const optionalSearchStringSchema = z.preprocess(
  emptyStringToUndefined,
  z.string().min(1).optional(),
);

const optionalQueryStringArraySchema = z.preprocess(
  (value) => {
    if (value === undefined || value === null) return undefined;
    return Array.isArray(value) ? value : [value];
  },
  z.array(z.string().min(1)).optional(),
);

const optionalListingConditionArraySchema = z.preprocess((value) => {
  if (value === undefined || value === null) return undefined;
  return Array.isArray(value) ? value : [value];
}, z.array(ListingConditionSchema).optional());

const optionalListingStatusArraySchema = z.preprocess((value) => {
  if (value === undefined || value === null) return undefined;
  return Array.isArray(value) ? value : [value];
}, z.array(ListingStatusSchema).optional());

const optionalNonNegativeNumberSchema = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  }

  return value;
}, z.number().nonnegative().optional());

const optionalPositiveIntegerSchema = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : value;
  }

  return value;
}, z.number().int().positive().optional());

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
  likeCount: z.number().int().nonnegative(),
  isLikedByUser: z.boolean(),
  condition: ListingConditionSchema,
  status: ListingStatusSchema,

  category: listingCategorySchema,

  images: z.array(listingImageSchema),

  seller: listingSellerSchema,

  createdAt: stringToDate,
  updatedAt: stringToDate,

  soldAt: stringToDate.nullable().optional(),
});

export const listingListSchema = z.array(listingSchema);
export const listingCategoryListSchema = z.array(listingCategorySchema);

export const listingPaginationQuerySchema = z.object({
  page: optionalPositiveIntegerSchema,
  limit: optionalPositiveIntegerSchema,
});

export const listingSearchQuerySchema = z
  .object({
    q: optionalSearchStringSchema,
    sortBy: listingSearchSortBySchema.optional(),
    sortOrder: listingSearchSortOrderSchema.optional(),
    category: optionalQueryStringArraySchema,
    condition: optionalListingConditionArraySchema,
    status: optionalListingStatusArraySchema,
    minPrice: optionalNonNegativeNumberSchema,
    maxPrice: optionalNonNegativeNumberSchema,
  })
  .merge(listingPaginationQuerySchema);

export const listingPageMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
});

export const listingPageSchema = z.object({
  data: listingListSchema,
  meta: listingPageMetaSchema,
});

export const createListingSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number().min(0),
  categoryId: z.string(),
  condition: ListingConditionSchema,
  status: ListingStatusSchema.optional(),
});

export const updateListingSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  condition: ListingConditionSchema.optional(),
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
export type ListingCategory = z.infer<typeof listingCategorySchema>;
export type ListingCategoryList = z.infer<typeof listingCategoryListSchema>;
export type Listing = z.infer<typeof listingSchema>;
export type ListingList = z.infer<typeof listingListSchema>;
export type ListingPaginationQuery = z.infer<
  typeof listingPaginationQuerySchema
>;
export type ListingSearchQuery = z.infer<typeof listingSearchQuerySchema>;
export type ListingPageMeta = z.infer<typeof listingPageMetaSchema>;
export type ListingPage = z.infer<typeof listingPageSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type UpdateListingStatusInput = z.infer<
  typeof updateListingStatusSchema
>;
