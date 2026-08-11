import { z } from 'zod';
import { UserEventTypeSchema } from '../enums.js';
import { stringToDate } from '../codecs.js';

export const userEventSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  listingId: z.string().nullable(),
  eventType: UserEventTypeSchema,
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  createdAt: stringToDate,
});

export const createUserEventSchema = z.object({
  eventType: UserEventTypeSchema,
  listingId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type UserEvent = z.infer<typeof userEventSchema>;
export type CreateUserEventInput = z.infer<typeof createUserEventSchema>;
