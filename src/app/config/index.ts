import { USER_ROLE } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const config = {
  port: Number(process.env.PORT),
  node_env: process.env.NODE_ENV as string,
  app_name: process.env.APP_NAME as string,
  client_url: process.env.CLIENT_URL as string,
  refresh_token_name: process.env.REFRESH_TOKEN_NAME as string,
  jwt: {
    access_token_secret: process.env.ACCESS_JWT_SECRET as string,
    access_token_expire: process.env.ACCESS_JWT_EXPIRE as string,
    refresh_token_secret: process.env.REFRESH_JWT_SECRET as string,
    refresh_token_expire: process.env.REFRESH_JWT_EXPIRE as string,
    reset_token_secret: process.env.RESET_JWT_SECRET as string,
    reset_token_expire: process.env.RESET_JWT_EXPIRE as string,
  },
  superAdmin: {
    username: process.env.SUPER_ADMIN_NAME as string,
    email: process.env.SUPER_ADMIN_EMAIL as string,
    password: process.env.SUPER_ADMIN_PASS as string,
    role: USER_ROLE.super_admin,
  },
  mail: {
    host: process.env.MAIL_HOST as string,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER as string,
      pass: process.env.MAIL_PASS as string,
    },
  },
  cloud: {
    cloud_name: process.env.CLOUD_NAME as string,
    cloud_api: process.env.CLOUD_API as string,
    cloud_secret: process.env.CLOUD_SECRET as string,
  },
};

export default config;
