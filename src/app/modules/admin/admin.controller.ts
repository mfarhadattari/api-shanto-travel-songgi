import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import getOptions from '../../utils/getOption';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';
import peekObject from '../../utils/peekObject';
import { USERSFILTERABLEFIELDS } from './admin.const';
import { IFile } from '../../utils/fileUpload';

/* --------------------->> Get Users <<-------------- */
const getUsers = catchAsync(async (req, res) => {
  const options = getOptions(req.query);
  const query = peekObject(req.query, USERSFILTERABLEFIELDS);
  const result = await AdminServices.getUsers(req.user, query, options);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

/* --------------------->> Update User <<-------------- */
const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await AdminServices.updateUser(req.user, userId, req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

/* --------------------->> delete trip <<-------------- */
const deleteTrip = catchAsync(async (req, res) => {
  const tripId = req.params.tripId;
  await AdminServices.deleteTrip(tripId);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Trip deleted successfully',
  });
});

/* --------------------->> update trip <<-------------- */
const updateTrip = catchAsync(async (req, res) => {
  const tripId = req.params.tripId;
  const result = await AdminServices.updateTrip(
    tripId,
    req.body,
    req.files as IFile[],
  );
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Trip updated successfully',
    data: result,
  });
});

export const AdminControllers = {
  getUsers,
  updateUser,
  deleteTrip,
  updateTrip,
};
