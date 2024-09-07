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

export const AuthControllers = { registerUser, loginUser };
