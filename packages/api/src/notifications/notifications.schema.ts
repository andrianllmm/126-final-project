import { z } from 'zod';
import { stringToDate } from '../codecs.js';
import { NotificationTypeSchema } from '../enums.js';

export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  message: z.string(),
  actionLink: z.string().nullable().optional(),
  isRead: z.boolean(),
  createdAt: stringToDate,
});

export const notificationListSchema = z.array(notificationSchema);

export const notificationFiltersSchema = z.object({
  read: z.boolean().optional(),
});

export const notificationCountSchema = z.number().int().nonnegative();

export type Notification = z.infer<typeof notificationSchema>;
export type NotificationList = z.infer<typeof notificationListSchema>;
export type NotificationFilters = z.infer<typeof notificationFiltersSchema>;
