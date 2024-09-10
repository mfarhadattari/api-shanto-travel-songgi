import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TripServices } from './trip.service';

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

export const TripControllers = {
  createTrip,
};
