import { createZodDto } from 'nestjs-zod';
import {
  createListingSchema,
  listingCategoryListSchema,
  listingListSchema,
  listingSchema,
  updateListingSchema,
  updateListingStatusSchema,
} from '@repo/api';

export class ListingDto extends createZodDto(listingSchema, {
  codec: true,
}) {}

export class ListingListDto extends createZodDto(listingListSchema, {
  codec: true,
}) {}

export class CreateListingDto extends createZodDto(createListingSchema) {}

export class UpdateListingDto extends createZodDto(updateListingSchema) {}

export class UpdateListingStatusDto extends createZodDto(
  updateListingStatusSchema,
) {}

export class SearchListingCategoriesDto extends createZodDto(
  listingCategoryListSchema,
) {}
