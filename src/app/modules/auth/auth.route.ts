import express from 'express';
import { AuthControllers } from './auth.controller';
import reqBodyValidator from '../../middlewares/reqBodyValidator';
import { AuthValidationSchemas } from './auth.validation';
import authValidator from '../../middlewares/authValidator';
import { USER_ROLE } from '@prisma/client';
import { upload } from '../../utils/fileUpload';
import parseFormData from '../../middlewares/parseFormData';

const router = express.Router();

/* ------------------>> REGISTER USER API (PUBLIC) <<-------------- */
router.post(
  '/register',
  upload.single('file'),
  parseFormData,
  reqBodyValidator(AuthValidationSchemas.registerUser),
  AuthControllers.registerUser,
);

/* ------------------>> LOGIN USER API (PUBLIC) <<-------------- */
router.post(
  '/login',
  reqBodyValidator(AuthValidationSchemas.loginUser),
  AuthControllers.loginUser,
);

/* ------------------>> GET PROFILE API (PRIVATE) <<-------------- */
router.get(
  '/profile',
  authValidator(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.user),
  AuthControllers.userProfile,
);

/* ------------------>> UPDATE PROFILE API (PRIVATE) <<-------------- */
router.patch(
  '/profile',
  authValidator(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.user),
  upload.single('file'),
  parseFormData,
  reqBodyValidator(AuthValidationSchemas.updateProfile),
  AuthControllers.updateProfile,
);

/* ------------------>> CHANGE PASSWORD API (PRIVATE) <<-------------- */
router.patch(
  '/change-password',
  authValidator(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.user),
  reqBodyValidator(AuthValidationSchemas.changePassword),
  AuthControllers.changePassword,
);

/* ------------------>> FORGET PASSWORD API (PUBLIC) <<-------------- */
router.post(
  '/forget-password',
  reqBodyValidator(AuthValidationSchemas.forgetPassword),
  AuthControllers.forgetPassword,
);

/* ------------------>> RESET PASSWORD API (PUBLIC) <<-------------- */
router.post(
  '/reset-password',
  reqBodyValidator(AuthValidationSchemas.resetPassword),
  AuthControllers.resetPassword,
);

export const AuthRoutes = router;
