import z from 'zod';
import { USERROLE, USERSTATUS } from './admin.const';

const updateUser = z.object({
  body: z.object({
    status: z.enum([...USERSTATUS] as [string, ...string[]]).optional(),
    role: z.enum([...USERROLE] as [string, ...string[]]).optional(),
  }),
});

export const AdminValidationSchemas = {
  updateUser,
};
