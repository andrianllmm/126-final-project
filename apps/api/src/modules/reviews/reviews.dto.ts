import { createZodDto } from 'nestjs-zod';
import { reviewListSchema, reviewSchema } from '@repo/api';

export class ReviewDto extends createZodDto(reviewSchema, {
  codec: true,
}) {}

export class ReviewListDto extends createZodDto(reviewListSchema, {
  codec: true,
}) {}
