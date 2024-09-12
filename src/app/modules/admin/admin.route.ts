import express from 'express';
import authValidator from '../../middlewares/authValidator';
import { AdminControllers } from './admin.controller';
import reqBodyValidator from '../../middlewares/reqBodyValidator';
import { AdminValidationSchemas } from './admin.validation';
import { upload } from '../../utils/fileUpload';
import parseFormData from '../../middlewares/parseFormData';

const router = express.Router();

/* -------------->> GET USER API (PRIVATE) <<----------------- */
router.get(
  '/users',
  authValidator('super_admin', 'admin'),
  AdminControllers.getUsers,
);

/* -------------->> UPDATE USER API (PRIVATE) <<----------------- */
router.patch(
  '/users/:userId',
  authValidator('super_admin', 'admin'),
  reqBodyValidator(AdminValidationSchemas.updateUser),
  AdminControllers.updateUser,
);

/* -------------->> DELETE TRIP API (PRIVATE) <<----------------- */
router.delete(
  '/trips/:tripId',
  authValidator('super_admin', 'admin'),
  AdminControllers.deleteTrip,
);

/* -------------->> UPDATE TRIP API (PRIVATE) <<----------------- */
router.patch(
  '/trips/:tripId',
  authValidator('super_admin', 'admin'),
  upload.array('files'),
  parseFormData,
  reqBodyValidator(AdminValidationSchemas.updateTrip),
  AdminControllers.updateTrip,
);

export const AdminRoutes = router;
