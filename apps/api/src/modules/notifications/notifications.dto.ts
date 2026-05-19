import { createZodDto } from 'nestjs-zod';
import { notificationListSchema, notificationSchema } from '@repo/api';

export class NotificationDto extends createZodDto(notificationSchema, {
  codec: true,
}) {}

export class NotificationListDto extends createZodDto(notificationListSchema, {
  codec: true,
}) {}
