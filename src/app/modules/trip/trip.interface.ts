import { TRIP_REQ_STATUS, TRIP_TYPES } from '@prisma/client';

export interface ICreateTrip {
  destination: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: TRIP_TYPES;
  photos?: string[];
}

export interface IUpdateTripReqStatus {
  tripId: string;
  userId: string;
  status: TRIP_REQ_STATUS;
}
