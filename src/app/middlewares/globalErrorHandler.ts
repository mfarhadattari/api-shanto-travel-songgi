/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = error.status || httpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Something went wrong';

  res.status(status).json({
    success: false,
    message: message,
    error: error,
  });
};

export default globalErrorHandler;
