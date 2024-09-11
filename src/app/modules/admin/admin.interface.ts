import { USER_ROLE, USER_STATUS } from '@prisma/client';

export interface IUpdateUser {
  role: USER_ROLE;
  status: USER_STATUS;
}
