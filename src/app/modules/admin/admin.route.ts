import express from 'express';
import authValidator from '../../middlewares/authValidator';
import { AdminControllers } from './admin.controller';

const router = express.Router();

router.get(
  '/users',
  authValidator('super_admin', 'admin'),
  AdminControllers.getUsers,
);

export const AdminRoutes = router;
