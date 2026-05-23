import { z } from 'zod';

export const locationSchema = z.object({
  id: z.number(),
  name: z.string(),
  position: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
});

export const createLocationSchema = z.object({
  name: z.string(),
  position: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
});
