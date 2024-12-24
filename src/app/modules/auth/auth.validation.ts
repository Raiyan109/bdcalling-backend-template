import { z } from 'zod';

const createVerifyEmailZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    oneTimeCode: z
      .union([z.string().transform(val => parseFloat(val)), z.number()])
      .refine((val: any) => !isNaN(val), {
        message: 'One time code is required',
      }),
  }),
});

const createLoginZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).optional(),
    password: z.string({ required_error: 'Password is required' }).optional(),
  }),
});

const createLoginZodSchemaForSocial = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).optional(),
    appId: z.string({ required_error: 'AppId is required' }).optional(),
    famToken: z.string({ required_error: 'AppId is required' }).optional(),
    role: z.enum(['CLIENT', 'DRIVER']).optional(),
  }),
});

const createForgetPasswordZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
  }),
});

const createResetPasswordZodSchema = z.object({
  body: z.object({
    newPassword: z.string({ required_error: 'Password is required' }),
    confirmPassword: z.string({
      required_error: 'Confirm Password is required',
    }),
  }),
});

const createChangePasswordZodSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current Password is required',
    }),
    newPassword: z.string({ required_error: 'New Password is required' }),
    confirmPassword: z.string({
      required_error: 'Confirm Password is required',
    }),
  }),
});

export const AuthValidation = {
  createVerifyEmailZodSchema,
  createForgetPasswordZodSchema,
  createLoginZodSchema,
  createResetPasswordZodSchema,
  createLoginZodSchemaForSocial,
  createChangePasswordZodSchema,
};
