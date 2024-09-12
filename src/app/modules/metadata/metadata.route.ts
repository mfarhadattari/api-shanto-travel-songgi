import express from 'express';
import { MetadataControllers } from './metadata.controller';
import authValidator from '../../middlewares/authValidator';

const router = express.Router();

router.get(
  '/',
  authValidator('super_admin', 'admin', 'user'),
  MetadataControllers.getMetadata,
);

export const MetadataRoutes = router;
