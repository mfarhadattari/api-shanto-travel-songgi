import express from 'express';
import { AuthControllers } from './auth.controller';
import reqBodyValidator from '../../middlewares/reqBodyValidator';
import { AuthValidationSchemas } from './auth.validation';
import authValidator from '../../middlewares/authValidator';
import { USER_ROLE } from '@prisma/client';

const router = express.Router();

router.post(
  '/register',
  reqBodyValidator(AuthValidationSchemas.registerUser),
  AuthControllers.registerUser,
);

router.post(
  '/login',
  reqBodyValidator(AuthValidationSchemas.loginUser),
  AuthControllers.loginUser,
);

router.get(
  '/profile',
  authValidator(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.user),
  AuthControllers.userProfile,
);

router.patch(
  '/profile',
  authValidator(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.user),
  reqBodyValidator(AuthValidationSchemas.updateUser),
  AuthControllers.updateProfile,
);

export const AuthRoutes = router;
