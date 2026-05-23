import { createZodDto } from 'nestjs-zod';
import { offerSchema, offerListSchema, createOfferSchema } from '@repo/api';

export class OfferDto extends createZodDto(offerSchema, {
  codec: true,
}) {}

export class OfferListDto extends createZodDto(offerListSchema, {
  codec: true,
}) {}

export class CreateOfferDto extends createZodDto(createOfferSchema) {}
