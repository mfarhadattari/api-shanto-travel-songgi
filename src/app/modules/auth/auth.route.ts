import express from 'express';
import { AuthControllers } from './auth.controller';
import reqBodyValidator from '../../middlewares/reqBodyValidator';
import { AuthValidationSchemas } from './auth.validation';

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

export const AuthRoutes = router;
