import { z } from 'zod';
import { TRIPTYPES } from './trip.const';

const createTrip = z.object({
  body: z.object({
    destination: z.string({
      required_error: 'Please provide destination',
    }),
    description: z.string({
      required_error: 'Please provide description',
    }),
    startDate: z
      .string({
        required_error: 'Please provide start date',
      })
      .datetime(),
    endDate: z
      .string({
        required_error: 'Please provide end date',
      })
      .datetime(),
    type: z.enum([...TRIPTYPES] as [string, ...string[]]),
  }),
});

export const TripValidationSchemas = {
  createTrip,
};
