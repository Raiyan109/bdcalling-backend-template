import { z } from 'zod';

const createInformativeVideoSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  description: z.string({ required_error: 'Description is required' }),
});

const updatedInformativeVideoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export const InformativeVideoValidation = {
  createInformativeVideoSchema,
  updatedInformativeVideoSchema,
};
