import { z } from 'zod';

export const ClientSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['active', 'suspended', 'deleted']).optional(),
  phone: z.string().optional(),
});

export const ClientValidation = {
  ClientSchema,
};
