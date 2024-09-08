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

router.patch(
  '/change-password',
  authValidator(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.user),
  reqBodyValidator(AuthValidationSchemas.changePassword),
  AuthControllers.changePassword,
);

router.post(
  '/forget-password',
  reqBodyValidator(AuthValidationSchemas.forgetPassword),
  AuthControllers.forgetPassword,
);

router.post(
  '/reset-password',
  reqBodyValidator(AuthValidationSchemas.resetPassword),
  AuthControllers.resetPassword,
);

export const AuthRoutes = router;
