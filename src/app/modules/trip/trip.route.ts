import express from 'express';
import authValidator from '../../middlewares/authValidator';
import reqBodyValidator from '../../middlewares/reqBodyValidator';
import { TripValidationSchemas } from './trip.validation';
import { TripControllers } from './trip.controller';

const router = express.Router();

router.post(
  '/',
  authValidator('user', 'super_admin', 'admin'),
  reqBodyValidator(TripValidationSchemas.createTrip),
  TripControllers.createTrip,
);

router.get('/', TripControllers.getTrips);

export const TripRoutes = router;
