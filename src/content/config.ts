import { defineCollection, z } from 'astro:content';

const testimonialsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    text: z.string(),
    author: z.string(),
    isVerified: z.boolean().optional(),
    vehicle: z.string().optional(),
  }),
});

export const collections = {
  testimonials: testimonialsCollection,
};
