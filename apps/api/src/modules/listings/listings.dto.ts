import { createZodDto } from 'nestjs-zod';
import {
  createListingSchema,
  updateListingSchema,
  updateListingStatusSchema,
} from '@repo/api';

export class CreateListingDto extends createZodDto(createListingSchema) {}

export class UpdateListingDto extends createZodDto(updateListingSchema) {}

export class UpdateListingStatusDto extends createZodDto(
  updateListingStatusSchema,
) {}
