import z from 'zod';

const registerUser = z.object({
  body: z.object({
    username: z.string({ required_error: 'Please provide username' }),
    email: z.string({ required_error: 'Please provide email' }).email({
      message: 'Please provide valid email address',
    }),
    password: z.string({ required_error: 'Please provide password' }).min(6, {
      message: 'Password must be at least 6 characters long',
    }),
  }),
});

const loginUser = z.object({
  body: z.object({
    email: z.string({ required_error: 'Please provide email' }).email({
      message: 'Please provide valid email address',
    }),
    password: z.string({ required_error: 'Please provide password' }).min(6, {
      message: 'Password must be at least 6 characters long',
    }),
  }),
});

const updateUser = z.object({
  body: z.object({
    username: z.string().optional(),
    email: z
      .string()
      .email({
        message: 'Please provide valid email address',
      })
      .optional(),
  }),
});

const forgetPassword = z.object({
  body: z.object({
    email: z.string({ required_error: 'Please provide email' }).email({
      message: 'Please provide valid email address',
    }),
  }),
});

const resetPassword = z.object({
  body: z.object({
    password: z.string({ required_error: 'Please provide password' }).min(6, {
      message: 'Password must be at least 6 characters long',
    }),
  }),
});

export const AuthValidationSchemas = {
  registerUser,
  loginUser,
  updateUser,
  resetPassword,
  forgetPassword,
};
