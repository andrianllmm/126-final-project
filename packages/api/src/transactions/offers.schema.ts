import { z } from 'zod';
import { OfferStatusSchema } from '../enums.js';
import { stringToDate } from '../codecs.js';

export const offerUserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const offerSchema = z.object({
  id: z.string(),
  transactionId: z.string(),

  proposerId: z.string(),
  proposer: offerUserSchema.optional(),

  price: z.number().optional(),
  meetupLocation: z.string().optional(),
  meetupTime: stringToDate.optional(),

  status: OfferStatusSchema,

  createdAt: stringToDate,
});

export const offerListSchema = z.array(offerSchema);

export const createOfferSchema = z.object({
  transactionId: z.string(),

  price: z.number().optional(),
  meetupLocation: z.string().optional(),
  meetupTime: stringToDate.optional(),
});

export type Offer = z.infer<typeof offerSchema>;
export type OfferList = z.infer<typeof offerListSchema>;
export type CreateOfferInput = z.infer<typeof createOfferSchema>;
