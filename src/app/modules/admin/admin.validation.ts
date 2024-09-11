import z from 'zod';
import { USERROLE, USERSTATUS } from './admin.const';
import { TRIPTYPES } from '../trip/trip.const';

const updateUser = z.object({
  body: z.object({
    status: z.enum([...USERSTATUS] as [string, ...string[]]).optional(),
    role: z.enum([...USERROLE] as [string, ...string[]]).optional(),
  }),
});

const updateTrip = z.object({
  body: z.object({
    destination: z
      .string({
        required_error: 'Please provide destination',
      })
      .optional(),
    description: z
      .string({
        required_error: 'Please provide description',
      })
      .optional(),
    startDate: z
      .string({
        required_error: 'Please provide start date',
      })
      .date()
      .optional(),
    endDate: z
      .string({
        required_error: 'Please provide end date',
      })
      .date()
      .optional(),
    type: z.enum([...TRIPTYPES] as [string, ...string[]]).optional(),
  }),
});

export const AdminValidationSchemas = {
  updateUser,
  updateTrip,
};
