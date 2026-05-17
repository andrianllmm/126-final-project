import { createZodDto } from 'nestjs-zod';
import {
  messageSchema,
  conversationSchema,
  conversationListSchema,
  sendMessageInputSchema,
} from '@repo/api';

export class MessageDto extends createZodDto(messageSchema, {
  codec: true,
}) {}

export class ConversationDto extends createZodDto(conversationSchema, {
  codec: true,
}) {}

export class ConversationListDto extends createZodDto(conversationListSchema, {
  codec: true,
}) {}

export class SendMessageInputDto extends createZodDto(sendMessageInputSchema) {}
