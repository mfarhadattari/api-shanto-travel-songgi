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

router.get('/:tripId', TripControllers.getTripDetails);

router.get('/:tripId/request', TripControllers.getTripRequests);

router.post(
  '/:tripId/request',
  authValidator('user', 'super_admin', 'admin'),
  TripControllers.requestForTrip,
);

router.patch(
  '/request-status',
  authValidator('user', 'super_admin', 'admin'),
  reqBodyValidator(TripValidationSchemas.updateTripReqStatus),
  TripControllers.acceptOrRejectTripRequest,
);

export const TripRoutes = router;
