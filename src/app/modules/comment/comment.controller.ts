import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CommentService } from './comment.service';

const createCommentToDB = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const value = {
    ...req.body,
    userId: userId,
  };

  const result = await CommentService.createCommentToDB(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Comment created successfully',
    data: result,
  });
});

const getSingleComment = catchAsync(async (req, res) => {
  const result = await CommentService.getSingleComment(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Single Comment retrieved successfully',
    data: result,
  });
});

const getAllComment = catchAsync(async (req, res) => {
  const value = {
    ...req.query,
    deliveryId: req.params.id,
  };

  const result = await CommentService.getAllComment(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Comment retrieved successfully',
    data: result,
  });
});

export const CommentController = {
  createCommentToDB,
  getSingleComment,
  getAllComment,
};
