import { Prisma, Trip } from '@prisma/client';
import prismaDB from '../../../prismaDB';
import { ITokenPayload } from '../../utils/jwt';
import { IOptions } from '../../utils/getOption';
import ApiError from '../../error/ApiError';
import httpStatus from 'http-status';
import { USERROLE, USERSTATUS } from './admin.const';
import { IUpdateUser } from './admin.interface';

/* --------------------->> Get Users <<-------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUsers = async (user: ITokenPayload, query: any, options: IOptions) => {
  const andCondition: Prisma.UserWhereInput[] = [];

  if (user.role === 'admin') {
    andCondition.push({
      role: 'user',
    });
  } else if (user.role === 'super_admin') {
    andCondition.push({
      role: {
        in: ['user', 'admin'],
      },
    });
  } else {
    throw new ApiError(httpStatus.FORBIDDEN, 'Unauthorized');
  }

  const { searchTerm, status, role } = query;

  // searching by username or email
  if (searchTerm) {
    andCondition.push({
      OR: [
        {
          username: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ],
    });
  }

  // filtering by status and role
  if (status && USERSTATUS.includes(status)) {
    andCondition.push({
      status: status,
    });
  }

  if (role && USERROLE.includes(role)) {
    andCondition.push({
      role: role,
    });
  }

  const result = await prismaDB.user.findMany({
    where: {
      AND: andCondition,
    },
    skip: options.skip,
    take: options.limit,
    orderBy: {
      [options.sortBy]: options.sortOrder,
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      status: true,
      isPasswordChanged: true,
    },
  });

  const total = await prismaDB.user.count({
    where: { AND: andCondition },
  });

  return {
    data: result,
    meta: {
      limit: options.limit,
      page: options.page,
      total: total,
    },
  };
};

/* ---------------------->> Updated User <<---------------- */
const updateUser = async (
  user: ITokenPayload,
  userId: string,
  payload: IUpdateUser,
) => {
  // check user
  const isUserExist = await prismaDB.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // check user access
  const isAccess = user.role === 'super_admin' || isUserExist.role === 'user';
  if (!isAccess) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Unauthorized, not have access');
  }

  // update user
  await prismaDB.user.update({
    where: {
      id: userId,
    },
    data: payload,
  });

  // get user
  const result = await prismaDB.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      status: true,
      isPasswordChanged: true,
    },
  });

  return result;
};

/* ---------------------->> Delete Trip <<-------------------- */
const deleteTrip = async (tripId: string) => {
  // check trip
  const tripExist = await prismaDB.trip.findUnique({
    where: {
      id: tripId,
      isDeleted: false,
    },
  });

  if (!tripExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip is not found');
  }

  await prismaDB.$transaction(async (txClient) => {
    try {
      // delete trip request
      await txClient.tripReq.deleteMany({
        where: {
          tripId: tripId,
        },
      });

      // delete trip
      await txClient.trip.update({
        where: { id: tripId },
        data: {
          isDeleted: true,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  });
};

/* ---------------------->> Update Trip <<-------------------- */
const updateTrip = async (tripId: string, payload: Trip) => {
  // check trip
  const tripExist = await prismaDB.trip.findUnique({
    where: {
      id: tripId,
      isDeleted: false,
    },
  });

  if (!tripExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip is not found');
  }

  // update trip
  const result = await prismaDB.trip.update({
    where: {
      id: tripId,
    },
    data: payload,
  });

  return result;
};

export const AdminServices = {
  getUsers,
  updateUser,
  deleteTrip,
  updateTrip,
};
