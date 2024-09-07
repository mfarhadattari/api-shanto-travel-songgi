import { USER_ROLE, USER_STATUS } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../error/ApiError';
import { decodeToken, ITokenPayload } from '../utils/jwt';
import config from '../config';
import prismaDB from '../../prismaDB';

const authValidator = (...roles: USER_ROLE[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // check token exist
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Invalid authorization token',
        );
      }

      // decode token
      const decodedToken = (await decodeToken(
        token,
        config.jwt.access_token_secret,
      )) as ITokenPayload;

      // check role
      if (!roles.includes(decodedToken.role)) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'User does not have access',
        );
      }

      // check user exist
      const userExist = await prismaDB.user.findUnique({
        where: {
          id: decodedToken.id,
          email: decodedToken.email,
          role: decodedToken.role,
          status: USER_STATUS.active,
        },
      });

      if (!userExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      // set user in request
      req.user = decodedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authValidator;
