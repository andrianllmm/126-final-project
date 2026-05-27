'use server';

import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

import { ListingConditionSchema, type ListingFormValues } from '@repo/api';
import type { ListingCategory } from '@repo/api';

const listingFormAutofillSchema = z.object({
  title: z.string().min(1),
  categoryId: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string().min(1),
  condition: ListingConditionSchema,
});

interface AutofillListingFormFromImageInput {
  mainImage: string;
  categories: ListingCategory[];
}

export async function autofillListingFormFromImage({
  mainImage,
  categories,
}: AutofillListingFormFromImageInput): Promise<ListingFormValues | null> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return null;
  }

  if (!mainImage || categories.length === 0) {
    return null;
  }

  try {
    const categoryIds = categories.map((category) => category.id);
    if (categoryIds.length === 0) {
      return null;
    }

    const categorySchema = z.enum(categoryIds as [string, ...string[]]);

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      output: Output.object({
        schema: listingFormAutofillSchema.extend({
          categoryId: categorySchema,
        }),
      }),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: [
                'Analyze the product photo and generate useful marketplace listing defaults.',
                'Choose the best categoryId from the provided category list.',
                'Return a concise, accurate product title and description.',
                'Estimate a fair price in Philippine pesos as a number.',
                'Set condition to the closest match using NEW, LIKE_NEW, GOOD, FAIR, or FOR_PARTS.',
                '',
                'Categories:',
                ...categories.map(
                  (category) => `${category.id}: ${category.categoryName}`,
                ),
              ].join('\n'),
            },
            {
              type: 'image',
              image: mainImage,
            },
          ],
        },
      ],
    });

    return result.output;
  } catch {
    return null;
  }
}
