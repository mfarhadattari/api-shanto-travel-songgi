import { ITokenPayload } from '../../utils/jwt';
import { ICreateTrip } from './trip.interface';
import prismaDB from '../../../prismaDB';
import { IOptions } from '../../utils/getOption';
import { Prisma } from '@prisma/client';
import { TRIPTYPES } from './trip.const';
import dayjs from 'dayjs';

/* ------------->> Create Trip <<------------ */
const createTrip = async (user: ITokenPayload, payload: ICreateTrip) => {
  const dates = `${dayjs(payload.startDate).format('YYYY-MM-DD')}:${dayjs(payload.endDate).format('YYYY-MM-DD')}`;

  const result = await prismaDB.trip.create({
    data: {
      destination: payload.destination,
      description: payload.description,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      dates: dates,
      type: payload.type,
      userId: user.id,
    },
  });

  return result;
};

/* ------------->> Get Trips <<------------ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTrips = async (query: any, options: IOptions) => {
  const { searchTerm, ...filterQuery } = query;

  const andConditions: Prisma.TripWhereInput[] = [
    {
      isDeleted: false,
    },
  ];

  // searching
  if (searchTerm) {
    const searchCondition: Prisma.TripWhereInput[] = [
      {
        destination: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      {
        dates: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    ];

    if (TRIPTYPES.includes(searchTerm)) {
      searchCondition.push({
        type: {
          equals: searchTerm,
        },
      });
    }

    andConditions.push({
      OR: searchCondition,
    });
  }

  // filtering
  const filterCondition: Prisma.TripWhereInput[] = [];
  if (filterQuery.type) {
    if (TRIPTYPES.includes(filterQuery.type)) {
      filterCondition.push({
        type: {
          equals: filterQuery.type,
        },
      });
    }
  }

  if (filterQuery.startDate) {
    filterCondition.push({
      startDate: {
        gte: new Date(filterQuery.startDate),
      },
    });
  }

  if (filterQuery.endDate) {
    filterCondition.push({
      endDate: {
        lte: new Date(filterQuery.endDate),
      },
    });
  }

  andConditions.push({
    AND: filterCondition,
  });

  const result = await prismaDB.trip.findMany({
    where: {
      AND: andConditions,
    },
    skip: options.skip,
    take: options.limit,
    orderBy: {
      [options.sortBy]: options.sortOrder,
    },
  });

  const total = await prismaDB.trip.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: result,
    meta: {
      total: total,
      page: options.page,
      limit: options.limit,
    },
  };
};

export const TripServices = {
  createTrip,
  getTrips,
};
