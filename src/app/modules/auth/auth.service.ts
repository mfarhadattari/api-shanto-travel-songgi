import httpStatus from 'http-status';
import prismaDB from '../../../prismaDB';
import ApiError from '../../error/ApiError';
import { comparePassword, hashPassword } from '../../utils/bcrypt';
import {
  IChangePassword,
  IForgetPassword,
  ILoginUser,
  IRegisterUser,
  IResetPassword,
  IUpdateProfile,
} from './auth.interface';
import { USER_STATUS } from '@prisma/client';
import { decodeToken, generateToken, ITokenPayload } from '../../utils/jwt';
import config from '../../config';
import { sendPasswordResetMail } from './auth.utils';
import { IFile, uploadToCloud } from '../../utils/fileUpload';

/* --------------->> Register User <<---------------- */
const registerUser = async (payload: IRegisterUser, file: IFile) => {
  // check email is already existing account
  const userExist = await prismaDB.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (userExist) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Email is already in use');
  }

  // upload file
  if (file) {
    const id = `avatar-${payload.email}`;
    const res = await uploadToCloud(file, id, 'user-avatars');
    payload.avatar = res.secure_url;
  }

  //   store user into db
  payload.password = await hashPassword(payload.password);

  const result = await prismaDB.user.create({
    data: payload,
    select: {
      id: true,
      email: true,
      username: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

/* --------------->> Login User <<---------------- */
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

/* --------------->> User Profile <<---------------- */
const userProfile = async (user: ITokenPayload) => {
  const result = await prismaDB.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      status: true,
      isPasswordChanged: true,
      createdAt: true,
      updatedAt: true,
      trip: true,
      tripReq: true,
    },
  });

  return result;
};

/* --------------->> Update Profile <<---------------- */
const updateProfile = async (
  user: ITokenPayload,
  payload: IUpdateProfile,
  file: IFile,
) => {
  // check if email and its already exist
  if (payload.email) {
    const emailAlreadyUsed = await prismaDB.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (emailAlreadyUsed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Email is already in use');
    }
  }

  // upload file
  if (file) {
    const id = `avatar-${payload.email}`;
    const res = await uploadToCloud(file, id, 'user-avatars');
    payload.avatar = res.secure_url;
  }

  // update info
  await prismaDB.user.update({
    where: {
      id: user.id,
    },
    data: payload,
  });

  // retrieve new info
  const result = await prismaDB.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      avatar: true,
      status: true,
      isPasswordChanged: true,
      createdAt: true,
      updatedAt: true,
      trip: true,
      tripReq: true,
    },
  });

  return result;
};

/* --------------->>  Change Password <<---------------- */
const changePassword = async (
  user: ITokenPayload,
  payload: IChangePassword,
) => {
  // check password match
  const userData = await prismaDB.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
  });

  await comparePassword(payload.oldPassword, userData.password);

  // update password
  const password = await hashPassword(payload.newPassword);
  await prismaDB.user.update({
    where: {
      id: user.id,
    },
    data: {
      password,
      isPasswordChanged: true,
    },
  });
};

/* --------------->> Forget Password <<---------------- */
const forgetPassword = async (payload: IForgetPassword) => {
  // check user existence
  const isUserExist = await prismaDB.user.findUnique({
    where: {
      email: payload.email,
      status: USER_STATUS.active,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User not found using this email');
  }

  // generate reset token and link
  const tokenPayload: ITokenPayload = {
    id: isUserExist.id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const resetToken = await generateToken(tokenPayload, {
    secret: config.jwt.reset_token_secret,
    expiresIn: config.jwt.reset_token_expire,
  });
  const resetLink = `${config.client_url}/reset-password?email=${payload.email}&token=${resetToken}`;

  // send email
  await sendPasswordResetMail(payload.email, resetLink);
};

/* --------------->> Reset Password <<---------------- */
const resetPassword = async (payload: IResetPassword) => {
  // check user existence
  const isUserExist = await prismaDB.user.findUnique({
    where: {
      email: payload.email,
      status: USER_STATUS.active,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User not found using this email');
  }

  // decoded token
  const decoded = (await decodeToken(
    payload.token,
    config.jwt.reset_token_secret,
  )) as ITokenPayload;

  // check email is matches
  if (decoded.email != payload.email) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token');
  }

  // update password
  const password = await hashPassword(payload.password);
  await prismaDB.user.update({
    where: {
      email: payload.email,
    },
    data: {
      password,
      isPasswordChanged: true,
    },
  });

  // inform to user
};

export const AuthServices = {
  registerUser,
  loginUser,
  userProfile,
  changePassword,
  updateProfile,
  forgetPassword,
  resetPassword,
};
