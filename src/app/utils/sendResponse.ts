import { Response } from 'express';

export interface IMeta {
  total: number;
  page: number;
  limit: number;
}

interface IPayload<T> {
  success: boolean;
  message: string;
  status: number;
  data?: T;
  meta?: IMeta;
}

const sendResponse = <T>(res: Response, payload: IPayload<T>) => {
  const { status, ...data } = payload;
  res.status(status).json(data);
};

export default sendResponse;
