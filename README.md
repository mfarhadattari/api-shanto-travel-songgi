# api-shanto-travel-songgi

### RESTful api of shanto travel songgi. Backend api development using expressjs, typescript, prisma, postgresql and other.

## Key Features

- RESTful API using Express JS with Node JS.
- TypeScript for type safety.
- Prisma with PostgreSQL for database maintenance and operation.
- Secure Authentication using JSON web token and Bcrypt.
- Photo upload using Multer and Cloudinary.
- Request body validation using Zod

## Main Package or Library

- express
- typescript
- prisma
- nodemailer
- bcrypt
- jsonwebtoken
- multer
- cloudinary
- cors
- cookie-parser
- dayjs
- zod
- dotenv
- http-status
- ts-node-dev

## How to run locally

- Clone Repository

  ```bash
    git clone https://github.com/mfarhadattari/api-shanto-travel-songgi.git
  ```

- Go to directory

  ```bash
  cd api-shanto-travel-songgi
  ```

- Add env

  ```env
  DATABASE_URL= <DATABASE_URL>
  APP_NAME = <APP_NAME>
  PORT = <PORT>
  NODE_ENV = <NODE_ENV>
  CLIENT_URL = <CLIENT_URL>
  REFRESH_TOKEN_NAME = <REFRESH_TOKEN_NAME>
  ACCESS_JWT_SECRET = <ACCESS_JWT_SECRET>
  ACCESS_JWT_EXPIRE = <ACCESS_JWT_EXPIRE>
  REFRESH_JWT_SECRET = <REFRESH_JWT_SECRET>
  REFRESH_JWT_EXPIRE = <ACCESS_JWT_EXPIRE>
  RESET_JWT_SECRET = <RESET_JWT_SECRET>
  RESET_JWT_EXPRIE = <RESET_JWT_EXPRIE>
  SUPER_ADMIN_NAME = <SUPER_ADMIN_NAME>
  SUPER_ADMIN_EMAIL = <SUPER_ADMIN_EMAIL>
  SUPER_ADMIN_PASS = <SUPER_ADMIN_PASS>
  MAIL_USER = <MAIL_USER>
  MAIL_PASS = <MAIL_PASS>
  MAIL_HOST = <MAIL_HOST>
  MAIL_PORT = <MAIL_PORT>
  CLOUD_NAME = <CLOUD_NAME>
  CLOUD_API = <CLOUD_API>
  CLOUD_SECRET = <CLOUD_SECRET>
  ```

- Install Dependencies

  ```bash
  yarn
  ```

- Run Dev Project

  ```bash
  yarn dev
  ```

- Build Project

  ```bash
  yarn build
  ```

- Run Build Project

  ```bash
  yarn start
  ```

## Documentation

- API Doc: https://documenter.getpostman.com/view/31226472/2sAXqndizK
- ER Diagram: https://drive.google.com/file/d/1n_MoHLo4-qQBGxPKbqkk1LiJguYJxPyO/view?usp=sharing
