import { Prisma } from '@prisma/client';
import prismaDB from '../../../prismaDB';
import { ITokenPayload } from '../../utils/jwt';
import { IOptions } from '../../utils/getOption';
import ApiError from '../../error/ApiError';
import httpStatus from 'http-status';
import { USERROLE, USERSTATUS } from './admin.const';

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

export const AdminServices = {
  getUsers,
};
