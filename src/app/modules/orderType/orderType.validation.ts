import { z } from 'zod';

const createOrderTypeSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
  }),
});

const updatedOrderTypeSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const OrderTypeValidation = {
  createOrderTypeSchema,
  updatedOrderTypeSchema,
};
