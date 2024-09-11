import { USER_ROLE, USER_STATUS } from '@prisma/client';

export const ADMINFILTERABLEFIELDS = ['status', 'role', 'searchTerm'];

export const USERSTATUS: USER_STATUS[] = ['active', 'blocked'];

export const USERROLE: USER_ROLE[] = ['admin', 'user'];
