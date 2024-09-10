import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TripServices } from './trip.service';
import getOptions from '../../utils/getOption';
import peekObject from '../../utils/peekObject';
import { TRIPFILTERABLEFILEDS } from './trip.const';

/* ------------->> Create Trip <<------------ */
const createTrip = catchAsync(async (req, res) => {
  const result = await TripServices.createTrip(req.user, req.body);
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
    message: 'Trip retrieve successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const TripControllers = {
  createTrip,
  getTrips,
};
