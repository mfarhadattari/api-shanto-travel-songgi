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

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  try {
    const isMatched = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isMatched) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Wrong password');
    }
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};
