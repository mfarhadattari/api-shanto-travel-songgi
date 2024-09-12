import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TripServices } from './trip.service';
import getOptions from '../../utils/getOption';
import peekObject from '../../utils/peekObject';
import { TRIPFILTERABLEFILEDS } from './trip.const';
import { IFile } from '../../utils/fileUpload';

/* ------------->> Create Trip <<------------ */
const createTrip = catchAsync(async (req, res) => {
  const result = await TripServices.createTrip(
    req.user,
    req.body,
    req.files as IFile[],
  );
  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: 'Trip created successfully',
    data: result,
  });
});

/* ------------->> Get Trips <<------------ */
const getTrips = catchAsync(async (req, res) => {
  const query = peekObject(req.query, TRIPFILTERABLEFILEDS);
  const options = getOptions(req.query);
  const result = await TripServices.getTrips(query, options);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Trips retrieve successfully',
    meta: result.meta,
    data: result.data,
  });
});

/* ------------->> Get My Trips <<------------ */
const getMyTrips = catchAsync(async (req, res) => {
  const query = peekObject(req.query, TRIPFILTERABLEFILEDS);
  const options = getOptions(req.query);
  const result = await TripServices.getMyTrips(req.user, query, options);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Trips retrieve successfully',
    meta: result.meta,
    data: result.data,
  });
});

/* ------------->> Get Trip Details <<------------ */
const getTripDetails = catchAsync(async (req, res) => {
  const tripId = req.params.tripId;
  const result = await TripServices.getTripDetails(tripId);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Trip retrieve successfully',
    data: result,
  });
});

/* ------------->> Delete Trip <<------------ */
const deleteTrip = catchAsync(async (req, res) => {
  const tripId = req.params.tripId;
  await TripServices.deleteTrip(req.user, tripId);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Trip deleted successfully',
  });
});

/* ------------->> Update Trip <<------------ */
const updateTrip = catchAsync(async (req, res) => {
  const tripId = req.params.tripId;
  const result = await TripServices.updateTrip(req.user, tripId, req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Trip updated successfully',
    data: result,
  });
});

/* ------------->> Get Request of Trip <<------------ */
const getTripRequests = catchAsync(async (req, res) => {
  const tripId = req.params.tripId;
  const options = getOptions(req.query);
  const result = await TripServices.getTripRequests(tripId, options);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Trip request retrieve successfully',
    data: result,
  });
});

/* ------------->> Request For Trip <<------------ */
const requestForTrip = catchAsync(async (req, res) => {
  const tripId = req.params.tripId;
  const result = await TripServices.requestForTrip(req.user, tripId);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Trip requested successfully',
    data: result,
  });
});

/* ------------->> Accept or Reject Trip Request <<------------ */
const acceptOrRejectTripRequest = catchAsync(async (req, res) => {
  const result = await TripServices.acceptOrRejectTripRequest(
    req.user,
    req.body,
  );
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: `Trip ${result?.status} successfully`,
    data: result,
  });
});

export const TripControllers = {
  createTrip,
  getTrips,
  getMyTrips,
  getTripDetails,
  deleteTrip,
  updateTrip,
  getTripRequests,
  requestForTrip,
  acceptOrRejectTripRequest,
};
