import { USER_ROLE, USER_STATUS } from '@prisma/client';
import { ITokenPayload } from '../../utils/jwt';
import prismaDB from '../../../prismaDB';
import { IMetaData } from './metadata.interface';
import ApiError from '../../error/ApiError';
import httpStatus from 'http-status';

const getMetadata = async (
  user: ITokenPayload,
): Promise<IMetaData | undefined> => {
  if (user.role === USER_ROLE.admin || user.role === USER_ROLE.super_admin) {
    const totalActiveUser = await prismaDB.user.count({
      where: {
        role: USER_ROLE.user,
        status: USER_STATUS.active,
      },
    });

    const totalBlockedUser = await prismaDB.user.count({
      where: {
        role: USER_ROLE.user,
        status: USER_STATUS.blocked,
      },
    });

    const upcomingTrip = await prismaDB.trip.count({
      where: {
        startDate: {
          gt: new Date(),
        },
      },
    });

    const previousTrip = await prismaDB.trip.count({
      where: {
        endDate: {
          lt: new Date(),
        },
      },
    });

    const totalTripApproved = await prismaDB.tripReq.count({
      where: {
        status: 'approved',
      },
    });

    const totalTripRejected = await prismaDB.tripReq.count({
      where: {
        status: 'rejected',
      },
    });

    const totalTripPending = await prismaDB.tripReq.count({
      where: {
        status: 'pending',
      },
    });

    if (user.role === USER_ROLE.super_admin) {
      const totalActiveAdmin = await prismaDB.user.count({
        where: {
          role: USER_ROLE.admin,
          status: USER_STATUS.active,
        },
      });

      const totalBlockedAdmin = await prismaDB.user.count({
        where: {
          role: USER_ROLE.admin,
          status: USER_STATUS.blocked,
        },
      });

      return {
        activeUser: totalActiveUser,
        blockedUser: totalBlockedUser,
        totalUser: totalActiveUser + totalBlockedUser,
        activeAdmin: totalActiveAdmin,
        blockedAdmin: totalBlockedAdmin,
        totalAdmin: totalActiveAdmin + totalBlockedAdmin,
        upcomingTrip: upcomingTrip,
        previousTrip: previousTrip,
        tripApproved: totalTripApproved,
        tripRejected: totalTripRejected,
        tripPending: totalTripPending,
      };
    }

    return {
      activeUser: totalActiveUser,
      blockedUser: totalBlockedUser,
      totalUser: totalActiveUser + totalBlockedUser,
      upcomingTrip: upcomingTrip,
      previousTrip: previousTrip,
      tripApproved: totalTripApproved,
      tripRejected: totalTripRejected,
      tripPending: totalTripPending,
    };
  } else if (user.role === USER_ROLE.user) {
    const totalActiveTrips = await prismaDB.trip.count({
      where: {
        userId: user.id,
        isDeleted: false,
      },
    });

    const totalDeletedTrips = await prismaDB.trip.count({
      where: {
        userId: user.id,
        isDeleted: true,
      },
    });

    const totalTripApproved = await prismaDB.tripReq.count({
      where: {
        userId: user.id,
        status: 'approved',
      },
    });

    const totalTripRejected = await prismaDB.tripReq.count({
      where: {
        userId: user.id,
        status: 'rejected',
      },
    });

    const totalTripPending = await prismaDB.tripReq.count({
      where: {
        userId: user.id,
        status: 'pending',
      },
    });
    return {
      activeTrip: totalActiveTrips,
      deletedTrip: totalDeletedTrips,
      totalTrip: totalActiveTrips + totalDeletedTrips,
      tripApproved: totalTripApproved,
      tripRejected: totalTripRejected,
      tripPending: totalTripPending,
    };
  } else {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Unauthorized, you are not allowed',
    );
  }
};

export const MetadataServices = {
  getMetadata,
};
