import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import getOptions from '../../utils/getOption';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';
import peekObject from '../../utils/peekObject';
import { ADMINFILTERABLEFIELDS } from './admin.const';

/* --------------------->> Get Users <<-------------- */
const getUsers = catchAsync(async (req, res) => {
  const options = getOptions(req.query);
  const query = peekObject(req.query, ADMINFILTERABLEFIELDS);
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

export const AdminControllers = {
  getUsers,
  updateUser,
};
