import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    firstName: z
      .string({ required_error: 'FirstName name is required' })

      .optional(),
    lastName: z
      .string({ required_error: 'LastName name is required' })
      .optional(),
    email: z.string({ required_error: 'Email name is required' }),
    phone: z.string({ required_error: 'Phone name is required' }).optional(),
    password: z.string({ required_error: 'Password is required' }).optional(),
    address: z.string().optional(),
  }),
});

const updateZodSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const updateLocationZodSchema = z.object({
  body: z.object({
    longitude: z.string({ required_error: 'Longitude is required' }),
    latitude: z.string({ required_error: 'Latitude is required' }),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateZodSchema,
  updateLocationZodSchema,
};
