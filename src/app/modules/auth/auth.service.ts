import httpStatus from 'http-status';
import prismaDB from '../../../prismaDB';
import ApiError from '../../error/ApiError';
import { comparePassword, hashPassword } from '../../utils/bcrypt';
import { ILoginUser, IRegisterUser } from './auth.interface';
import { USER_STATUS } from '@prisma/client';
import { generateToken, ITokenPayload } from '../../utils/jwt';
import config from '../../config';

/* --------------->> Register User <---------------- */
const registerUser = async (payload: IRegisterUser) => {
  // check email is already existing account
  const userExist = await prismaDB.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (userExist) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Email is already in use');
  }

  //   store user into db
  payload.password = await hashPassword(payload.password);

  const result = await prismaDB.user.create({
    data: payload,
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

/* --------------->> Login User <---------------- */
const loginUser = async (payload: ILoginUser) => {
  // check user existence
  const userExist = await prismaDB.user.findUnique({
    where: {
      email: payload.email,
      status: USER_STATUS.active,
    },
  });
  if (!userExist) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User not found using this email');
  }

  // compare user password
  await comparePassword(payload.password, userExist.password);

  // generate token
  const tokenPayload: ITokenPayload = {
    id: userExist.id,
    email: userExist.email,
    role: userExist.role,
  };

  const accessToken = await generateToken(tokenPayload, {
    secret: config.jwt.access_token_secret,
    expiresIn: config.jwt.access_token_expire,
  });

  const refreshToken = await generateToken(tokenPayload, {
    secret: config.jwt.refresh_token_secret,
    expiresIn: config.jwt.refresh_token_expire,
  });

  return {
    accessToken,
    refreshToken,
    isPasswordChanged: userExist.isPasswordChanged,
  };
};

export const AuthServices = { registerUser, loginUser };
