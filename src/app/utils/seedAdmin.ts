/* eslint-disable no-console */
import bcrypt from 'bcrypt';
import prismaDB from '../../prismaDB';
import { USER_ROLE } from '@prisma/client';

interface ISuperAdminPayload {
  username: string;
  email: string;
  password: string;
  role: USER_ROLE;
}

const seedAdmin = async (payload: ISuperAdminPayload) => {
  try {
    // check already super admin exist
    const superAdminExist = await prismaDB.user.findFirst({
      where: {
        role: USER_ROLE.super_admin,
      },
    });

    // seed admin is not super admin
    if (!superAdminExist) {
      // hash password
      payload.password = await bcrypt.hash(payload.password, 8);
      // Save into database
      await prismaDB.user.create({
        data: payload,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export default seedAdmin;
