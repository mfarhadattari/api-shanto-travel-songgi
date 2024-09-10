import { TRIP_TYPES } from '@prisma/client';

export interface ICreateTrip {
  destination: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: TRIP_TYPES;
}
