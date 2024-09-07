import { Request, Response } from 'express';
import { AuthServices } from './auth.service';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

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

export const AuthControllers = { registerUser };
