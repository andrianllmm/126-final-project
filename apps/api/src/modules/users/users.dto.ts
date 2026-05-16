import { createZodDto } from 'nestjs-zod';
import {
  userProfileSchema,
  userProfileUpdateSchema,
  userProfileStatsSchema,
} from '@repo/api';

export class UserProfileDto extends createZodDto(userProfileSchema, {
  codec: true,
}) {}

export class UpdateMyProfileDto extends createZodDto(userProfileUpdateSchema) {}

export class UserProfileStatsDto extends createZodDto(userProfileStatsSchema) {}
