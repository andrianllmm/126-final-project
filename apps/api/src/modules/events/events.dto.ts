import { createZodDto } from 'nestjs-zod';
import {
  createUserEventSchema,
  searchHistorySchema,
  userEventSchema,
} from '@repo/api';

export class CreateUserEventDto extends createZodDto(createUserEventSchema) {}

export class UserEventDto extends createZodDto(userEventSchema, {
  codec: true,
}) {}

export class SearchHistoryDto extends createZodDto(searchHistorySchema) {}
