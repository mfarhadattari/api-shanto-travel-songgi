/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import ApiError from '../error/ApiError';
import httpStatus from 'http-status';

export const hashPassword = async (planPassword: string) => {
  try {
    const hashPassword = await bcrypt.hash(planPassword, 8);
    return hashPassword;
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};
