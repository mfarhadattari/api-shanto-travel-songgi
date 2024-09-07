/* eslint-disable @typescript-eslint/no-namespace */
import { ITokenPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user: ITokenPayload;
    }
  }
}
