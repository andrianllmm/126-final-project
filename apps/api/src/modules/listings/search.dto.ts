import { createZodDto } from 'nestjs-zod';

import { listingSearchQuerySchema } from '@repo/api';

export class SearchListingsQueryDto extends createZodDto(
  listingSearchQuerySchema,
) {}
