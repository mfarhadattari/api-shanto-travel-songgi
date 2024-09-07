import { RequestHandler } from 'express';
import httpStatus from 'http-status';

const notFoundHandler: RequestHandler = (req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API not found',
    data: {
      path: req.originalUrl,
      method: req.method,
    },
  });
  next();
};

export default notFoundHandler;
