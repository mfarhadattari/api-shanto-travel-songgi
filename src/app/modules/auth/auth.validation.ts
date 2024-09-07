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

export const AuthValidationSchemas = {
  registerUser,
};
