import { ITokenPayload } from '../../utils/jwt';
import { ICreateTrip, IUpdateTripReqStatus } from './trip.interface';
import prismaDB from '../../../prismaDB';
import { IOptions } from '../../utils/getOption';
import { Prisma, Trip } from '@prisma/client';
import { TRIPTYPES } from './trip.const';
import dayjs from 'dayjs';
import ApiError from '../../error/ApiError';
import httpStatus from 'http-status';
import { IFile, uploadToCloud } from '../../utils/fileUpload';

/* ------------->> Create Trip <<------------ */
const createTrip = async (
  user: ITokenPayload,
  payload: ICreateTrip,
  files: IFile[],
) => {
  const dates = `${dayjs(payload.startDate).format('YYYY-MM-DD')}:${dayjs(payload.endDate).format('YYYY-MM-DD')}`;
  if (files && files.length > 0) {
    const photos: string[] = [];
    const id = `userId:${user.id}-destination:${payload.destination}`;
    for (let i = 0; i < (files as IFile[]).length; i++) {
      const res = await uploadToCloud(
        (files as IFile[])[i],
        `${id}-${new Date()}`,
        'trips',
      );
      if (res.secure_url) {
        photos.push(res.secure_url);
      }
    }
    payload.photos = photos;
  }
  const result = await prismaDB.trip.create({
    data: {
      destination: payload.destination,
      description: payload.description,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      dates: dates,
      type: payload.type,
      photos: payload.photos,
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
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      tripReq: {
        select: {
          userId: true,
          tripId: true,
          status: true,
        },
      },
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

/* ------------->> Get My Trips <<------------ */
const getMyTrips = async (
  user: ITokenPayload,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  options: IOptions,
) => {
  const { searchTerm, ...filterQuery } = query;

  const andConditions: Prisma.TripWhereInput[] = [
    {
      userId: user.id,
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
    include: {
      tripReq: {
        select: {
          userId: true,
          tripId: true,
          status: true,
        },
      },
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

/* ------------->> Get Trip Details <<------------ */
const getTripDetails = async (tripId: string) => {
  const result = await prismaDB.trip.findUnique({
    where: { id: tripId, isDeleted: false },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      tripReq: {
        select: {
          userId: true,
          tripId: true,
          status: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }

  return result;
};

/* ------------->> Delete Trip  <<------------ */
const deleteTrip = async (user: ITokenPayload, tripId: string) => {
  // check trip
  const trip = await prismaDB.trip.findUnique({
    where: {
      id: tripId,
      userId: user.id,
      isDeleted: false,
    },
  });

  if (!trip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip in not found');
  }

  await prismaDB.$transaction(async (txClient) => {
    // delete trip request
    await txClient.tripReq.deleteMany({
      where: {
        tripId: tripId,
      },
    });

    // delete trip
    await txClient.trip.update({
      where: { id: tripId },
      data: { isDeleted: true },
    });
  });
};

/* ------------->> Update Trip  <<------------ */
const updateTrip = async (
  user: ITokenPayload,
  tripId: string,
  payload: Trip,
  files: IFile[],
) => {
  // check trip
  const trip = await prismaDB.trip.findUnique({
    where: {
      id: tripId,
      userId: user.id,
      isDeleted: false,
    },
  });

  if (!trip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip in not found');
  }

  if (files && files.length > 0) {
    const photos: string[] = [];
    const id = `userId:${user.id}-destination:${payload.destination}`;
    for (let i = 0; i < (files as IFile[]).length; i++) {
      const res = await uploadToCloud(
        (files as IFile[])[i],
        `${id}-${new Date()}`,
        'trips',
      );
      if (res.secure_url) {
        photos.push(res.secure_url);
      }
    }
    payload.photos = photos;
  }

  // update trip
  await prismaDB.trip.update({
    where: { id: tripId },
    data: payload,
  });

  // get trip details
  const result = await prismaDB.trip.findUnique({
    where: { id: tripId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      tripReq: {
        select: {
          userId: true,
          tripId: true,
          status: true,
        },
      },
    },
  });

  return result;
};

/* ------------->> Get Request of Trip <<------------ */
const getTripRequests = async (tripId: string, option: IOptions) => {
  const result = await prismaDB.tripReq.findMany({
    where: {
      tripId: tripId,
    },
    skip: option.skip,
    take: option.limit,
    orderBy: {
      [option.sortBy]: option.sortOrder,
    },
    include: {
      trip: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  const total = await prismaDB.tripReq.count({
    where: {
      tripId: tripId,
    },
  });

  if (!result || !total) {
    throw new ApiError(httpStatus.NOT_FOUND, 'There is no trip requests');
  }

  return {
    data: result,
    meta: {
      page: option.page,
      limit: option.limit,
      total: total,
    },
  };
};

/* ------------->> Request For Trip <<------------ */
const requestForTrip = async (user: ITokenPayload, tripId: string) => {
  const isTripExist = await prismaDB.trip.findUnique({
    where: { id: tripId, isDeleted: false },
  });
  if (!isTripExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }

  const isTripRequestExist = await prismaDB.tripReq.findFirst({
    where: {
      tripId: tripId,
      userId: user.id,
    },
  });

  if (isTripRequestExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Already requested for trip');
  }

  const result = await prismaDB.tripReq.create({
    data: {
      userId: user.id,
      tripId: tripId,
    },
  });

  return result;
};

/* ------------->> Accept or Reject Trip Request <<------------ */
const acceptOrRejectTripRequest = async (
  user: ITokenPayload,
  payload: IUpdateTripReqStatus,
) => {
  // check trip request
  const tripRequest = await prismaDB.tripReq.findFirst({
    where: {
      userId: payload.userId,
      tripId: payload.tripId,
    },
  });

  if (!tripRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip request not found');
  }

  // check trip
  const trip = await prismaDB.trip.findUnique({
    where: { id: payload.tripId, isDeleted: false },
  });

  if (!trip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }

  // check user role
  const isAccess =
    user.role === 'admin' ||
    user.role === 'super_admin' ||
    trip.userId === user.id;

  if (!isAccess) {
    throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized, don't have access");
  }

  // check pending, approved and rejected
  if (
    payload.status === tripRequest.status ||
    tripRequest.status === 'approved' ||
    tripRequest.status === 'rejected'
  ) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Trip request already ${tripRequest.status}`,
    );
  }

  // update status
  await prismaDB.tripReq.updateMany({
    where: {
      tripId: payload.tripId,
      userId: payload.userId,
    },
    data: { status: payload.status },
  });

  // get trip request details
  const result = await prismaDB.tripReq.findFirst({
    where: {
      userId: payload.userId,
      tripId: payload.tripId,
    },
  });

  return result;
};

export const TripServices = {
  createTrip,
  getTrips,
  getMyTrips,
  getTripDetails,
  deleteTrip,
  updateTrip,
  getTripRequests,
  requestForTrip,
  acceptOrRejectTripRequest,
};
