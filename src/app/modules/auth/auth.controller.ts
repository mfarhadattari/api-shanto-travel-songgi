import { Request, Response } from 'express';
import { AuthServices } from './auth.service';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import config from '../../config';

/* --------------->> Register User <---------------- */
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.registerUser(req.body);
  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully.',
    data: result,
  });
});

/* --------------->> Login User <---------------- */
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken, ...result } = await AuthServices.loginUser(req.body);

  res.cookie(config.refresh_token_name, refreshToken, {
    httpOnly: true,
    secure: true,
  });

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'User login successfully.',
    data: result,
  });
});

/* --------------->> Get User Profile <---------------- */
const userProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.userProfile(req.user);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Profile retrieve successfully.',
    data: result,
  });
});

/* --------------->> Update User Profile <---------------- */
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.updateProfile(req.user, req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully.',
    data: result,
  });
});

/* --------------->> Forget Password <---------------- */
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthServices.forgetPassword(req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Password reset link sent check email',
  });
});

/* --------------->> Reset Password <---------------- */
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    email: req.query.email as string,
    token: req.query.token as string,
    password: req.body.password as string,
  };
  await AuthServices.resetPassword(payload);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Password reset successfully',
  });
});

export const AuthControllers = {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  forgetPassword,
  resetPassword,
};
