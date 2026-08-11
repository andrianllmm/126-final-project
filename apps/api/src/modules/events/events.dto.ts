import { createZodDto } from 'nestjs-zod';
import { createUserEventSchema, userEventSchema } from '@repo/api';

export class CreateUserEventDto extends createZodDto(createUserEventSchema) {}

export class UserEventDto extends createZodDto(userEventSchema, {
  codec: true,
}) {}
