import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const config = {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  app_name: process.env.APP_NAME,
  client_url: process.env.CLIENT_URL,
  jwt: {
    access_token_secret: process.env.ACCESS_JWT_SECRET,
    access_token_expire: process.env.ACCESS_JWT_EXPIRE,
    refresh_token_secret: process.env.REFRESH_JWT_SECRET,
    refresh_token_expire: process.env.REFRESH_JWT_EXPIRE,
    reset_token_secret: process.env.RESET_JWT_SECRET,
    reset_token_expire: process.env.RESET_JWT_EXPIRE,
  },
  superAdmin: {
    name: process.env.SUPER_ADMIN_NAME,
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASS,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  },
  cloud: {
    cloud_name: process.env.CLOUD_NAME,
    cloud_api: process.env.CLOUD_API,
    cloud_secret: process.env.CLOUD_SECRET,
  },
};

export default config;
