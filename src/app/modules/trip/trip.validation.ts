import { z } from 'zod';
import { TRIPREQSTATUS, TRIPTYPES } from './trip.const';

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
      .date(),
    endDate: z
      .string({
        required_error: 'Please provide end date',
      })
      .date(),
    type: z.enum([...TRIPTYPES] as [string, ...string[]]),
  }),
});

const updateTripReqStatus = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'Please provide user id',
    }),
    tripId: z.string({
      required_error: 'Please provide trip id',
    }),
    status: z.enum([...TRIPREQSTATUS] as [string, ...string[]]),
  }),
});

export const TripValidationSchemas = {
  createTrip,
  updateTripReqStatus,
};
