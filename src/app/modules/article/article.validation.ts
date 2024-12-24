import { z } from 'zod';

export const ArticleSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  description: z.string({ required_error: 'Description is required' }),
  category: z.string({ required_error: 'Category is required' }),
});

export const ArticleSchemaUpdated = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
});

export const ArticleValidation = {
  ArticleSchema,
  ArticleSchemaUpdated,
};
