import { z } from 'zod';
import { stringToDate } from '../codecs.js';

export const conversationUserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  image: z.url().nullable(),
});

export const conversationListingSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
});

export const messageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  content: z.string(),
  isRead: z.boolean(),
  createdAt: stringToDate,

  sender: conversationUserSchema,
});

export const conversationMessagePreviewSchema = z.object({
  content: z.string(),
  createdAt: stringToDate,
  isRead: z.boolean(),
});

export const conversationSchema = z.object({
  id: z.string(),
  listingId: z.string(),
  buyerId: z.string(),
  sellerId: z.string(),
  lastMessageAt: stringToDate.nullable(),

  listing: conversationListingSchema,
  buyer: conversationUserSchema,
  seller: conversationUserSchema,

  messages: z.array(conversationMessagePreviewSchema).optional(),
});

export const conversationListSchema = z.array(conversationSchema);

export const sendMessageInputSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1),
});

export type Message = z.infer<typeof messageSchema>;
export type Conversation = z.infer<typeof conversationSchema>;
export type ConversationList = z.infer<typeof conversationListSchema>;
export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;
