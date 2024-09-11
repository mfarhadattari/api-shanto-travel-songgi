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

router.delete(
  '/trips/:tripId',
  authValidator('super_admin', 'admin'),
  AdminControllers.deleteTrip,
);

router.patch(
  '/trips/:tripId',
  authValidator('super_admin', 'admin'),
  reqBodyValidator(AdminValidationSchemas.updateTrip),
  AdminControllers.updateTrip,
);

export const AdminRoutes = router;
