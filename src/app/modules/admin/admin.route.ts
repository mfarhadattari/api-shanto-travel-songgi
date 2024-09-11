import express from 'express';
import authValidator from '../../middlewares/authValidator';
import { AdminControllers } from './admin.controller';
import reqBodyValidator from '../../middlewares/reqBodyValidator';
import { AdminValidationSchemas } from './admin.validation';

const router = express.Router();

router.get(
  '/users',
  authValidator('super_admin', 'admin'),
  AdminControllers.getUsers,
);

router.patch(
  '/users/:userId',
  authValidator('super_admin', 'admin'),
  reqBodyValidator(AdminValidationSchemas.updateUser),
  AdminControllers.updateUser,
);

export const AdminRoutes = router;
