import prismaDB from '../../../prismaDB';
import { hashPassword } from '../../utils/bcrypt';
import { IRegisterUser } from './auth.interface';

/* --------------->> Register User <---------------- */
const registerUser = async (payload: IRegisterUser) => {
  // check email is already existing account
  const userExist = await prismaDB.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (userExist) {
    throw new Error('Email already registered');
  }

  //   store user into db
  payload.password = await hashPassword(payload.password);

  const result = await prismaDB.user.create({
    data: payload,
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

export const AuthServices = { registerUser };
