import { z } from 'zod';

export const MessageSchema = z.object({
  senderId: z.string().optional(),
  recieverId: z.string().optional(),
  message: z.string().optional(),
});

export const MessageValidation = {
  MessageSchema,
};