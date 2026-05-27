import { createZodDto } from 'nestjs-zod';
import { createReviewSchema } from '@repo/api';

export class CreateReviewDto extends createZodDto(createReviewSchema) {}
