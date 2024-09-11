import { TRIP_REQ_STATUS, TRIP_TYPES } from '@prisma/client';

export const TRIPTYPES: TRIP_TYPES[] = [
  'adventure',
  'business',
  'cultural',
  'eco_tourism',
  'leisure',
  'medical',
  'others',
];

export const TRIPFILTERABLEFILEDS = [
  'startDate',
  'endDate',
  'type',
  'searchTerm',
];

export const TRIPREQSTATUS: TRIP_REQ_STATUS[] = [
  'pending',
  'approved',
  'rejected',
];
