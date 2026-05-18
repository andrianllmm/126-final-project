import { z } from 'zod';
import { isAllowedEmail } from './is-allowed-email.js';

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, 'Name is too short'),
    email: z
      .email('Invalid email address')
      .refine(isAllowedEmail, 'Only university email addresses are allowed'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
