import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MetadataServices } from './metadata.service';

const getMetadata = catchAsync(async (req, res) => {
  const result = await MetadataServices.getMetadata(req.user);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Metadata retrieved successfully.',
    data: result,
  });
});

export const MetadataControllers = {
  getMetadata,
};
