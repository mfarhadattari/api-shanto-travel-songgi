import { Response } from 'express';

interface IPayload<T> {
  success: boolean;
  message: string;
  status: number;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

const sendResponse = <T>(res: Response, payload: IPayload<T>) => {
  const { status, ...data } = payload;
  res.status(status).json(data);
};

export default sendResponse;
