import { Request, Response } from 'express';
import { AuthServices } from './auth.service';
import httpStatus from 'http-status';

/* --------------->> Register User <---------------- */
const registerUser = async (req: Request, res: Response) => {
  const result = await AuthServices.registerUser(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'User registered successfully.',
    data: result,
  });
};

export const AuthControllers = { registerUser };
