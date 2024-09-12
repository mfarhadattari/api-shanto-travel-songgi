import { NextFunction, Request, Response } from 'express';

const parseFormData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = await JSON.parse(req.body.data);
    next();
  } catch (error) {
    next(error);
  }
};

export default parseFormData;
