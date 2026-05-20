import { z } from 'zod';
import { createListingSchema } from '@repo/api';

export const CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'books', label: 'Books' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'other', label: 'Other' },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]['value'];

// Form schema with field name mapping
export const listingFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Product name is required')
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must be 100 characters or fewer'),

  categoryId: z.string().min(1, 'Category is required'),

  price: z.number().min(0.01, 'Price must be greater than 0'),

  meetupLocation: z
    .string()
    .min(1, 'Meetup location is required')
    .min(3, 'Meetup location must be at least 3 characters')
    .max(150, 'Meetup location must be 150 characters or fewer'),

  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be 1000 characters or fewer'),

  condition: z.string().min(1, 'Condition is required'),
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;

export function validateListingInput(data: ListingFormValues) {
  return createListingSchema.safeParse(data);
}
