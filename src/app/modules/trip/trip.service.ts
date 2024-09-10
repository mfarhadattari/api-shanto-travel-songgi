import { ITokenPayload } from '../../utils/jwt';
import { ICreateTrip } from './trip.interface';
import prismaDB from '../../../prismaDB';

/* ------------->> Create Trip <<------------ */
const createTrip = async (user: ITokenPayload, payload: ICreateTrip) => {
  const result = await prismaDB.trip.create({
    data: {
      destination: payload.destination,
      description: payload.description,
      startDate: payload.startDate,
      endDate: payload.endDate,
      type: payload.type,
      userId: user.id,
    },
  });

  return result;
};

export const TripServices = {
  createTrip,
};
