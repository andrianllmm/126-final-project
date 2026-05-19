import { z } from 'zod';
import { isAllowedEmail } from './is-allowed-email.js';

export const signInSchema = z.object({
  email: z
    .email('Invalid email address')
    .refine(isAllowedEmail, 'Only university email addresses are allowed'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignInInput = z.infer<typeof signInSchema>;
