import { z } from 'zod';

export const setPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SetPasswordInput = z.infer<typeof setPasswordSchema>;
