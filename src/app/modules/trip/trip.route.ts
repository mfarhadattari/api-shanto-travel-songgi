import express from 'express';
import authValidator from '../../middlewares/authValidator';
import reqBodyValidator from '../../middlewares/reqBodyValidator';
import { TripValidationSchemas } from './trip.validation';
import { TripControllers } from './trip.controller';
import { upload } from '../../utils/fileUpload';
import parseFormData from '../../middlewares/parseFormData';

const router = express.Router();

/* ---------------->> CREATE TRIP API (PRIVATE) <<-------------- */
router.post(
  '/',
  authValidator('user', 'super_admin', 'admin'),
  upload.array('files'),
  parseFormData,
  reqBodyValidator(TripValidationSchemas.createTrip),
  TripControllers.createTrip,
);

/* ---------------->> GET TRIP API (PUBLIC) <<-------------- */
router.get('/', TripControllers.getTrips);

/* ---------------->> GET MY TRIP API (PRIVATE) <<-------------- */
router.get(
  '/my-trips',
  authValidator('user', 'admin', 'super_admin'),
  TripControllers.getMyTrips,
);
/*  ---------------->> GET TRIP DETAILS API (PUBLIC) <<-------------- */
router.get('/:tripId', TripControllers.getTripDetails);

/* ---------------->> DELETE TRIP API (PRIVATE) <<-------------- */
router.delete(
  '/:tripId',
  authValidator('user', 'admin', 'super_admin'),
  TripControllers.deleteTrip,
);

/* ---------------->> UPDATE TRIP API (PRIVATE) <<-------------- */
router.patch(
  '/:tripId',
  authValidator('user', 'admin', 'super_admin'),
  upload.array('files'),
  parseFormData,
  reqBodyValidator(TripValidationSchemas.updateTrip),
  TripControllers.updateTrip,
);

/* ---------------->> GET REQUEST OF TRIP  API (PUBLIC) <<-------------- */
router.get('/:tripId/request', TripControllers.getTripRequests);

/* ---------------->>  REQUEST JOIN TRIP  API (PRIVATE) <<-------------- */
router.post(
  '/:tripId/request',
  authValidator('user', 'super_admin', 'admin'),
  TripControllers.requestForTrip,
);

/* ----------->> JOIN REQUEST STATUS UPDATE  API (PRIVATE) <<----------- */
router.patch(
  '/request-status',
  authValidator('user', 'super_admin', 'admin'),
  reqBodyValidator(TripValidationSchemas.updateTripReqStatus),
  TripControllers.acceptOrRejectTripRequest,
);

export const TripRoutes = router;
