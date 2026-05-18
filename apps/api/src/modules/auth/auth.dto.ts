import { createZodDto } from 'nestjs-zod';
import { setPasswordSchema } from '@repo/api';

export class SetPasswordDto extends createZodDto(setPasswordSchema) {}
