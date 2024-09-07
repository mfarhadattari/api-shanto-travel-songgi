/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError';
import httpStatus from 'http-status';
import { USER_ROLE } from '@prisma/client';

export interface ITokenPayload {
  id: string;
  email: string;
  role: USER_ROLE;
}

interface ITokenConfig {
  secret: string;
  expiresIn: string;
}

export const generateToken = async (
  payload: ITokenPayload,
  config: ITokenConfig,
) => {
  try {
    const token = await jwt.sign(payload, config.secret, {
      expiresIn: config.expiresIn,
    });
    if (!token) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to generate token',
      );
    }
    return token;
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};
