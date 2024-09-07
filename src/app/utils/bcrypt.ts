/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';

export const hashPassword = async (planPassword: string) => {
  try {
    const hashPassword = await bcrypt.hash(planPassword, 8);
    return hashPassword;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
