import { z } from 'zod';

export const deliveryConfirmationSchema = z.object({
  userId: z.string({ required_error: 'User ID is required' }).optional(),
  comment: z.string().optional(),
  orderId: z.string().optional(),
  deliveryNumber: z.string().optional(),
  problemOccurred: z.array(z.string()).optional(),
  status: z.enum(['delivered', 'not-delivered', 'problem-occurred']).optional(),
});

export const DeliveryConfirmationValidation = {
  deliveryConfirmationSchema,
};
