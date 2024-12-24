import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import { Request, Response } from 'express';
import { UserSuspentionService } from './userSuspention.service';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';

const suspendUserController = async (req: Request, res: Response) => {
  try {
    const { userId, days } = req.body;

    if (!userId || !days) {
      return res
        .status(400)
        .json({ error: 'User ID and suspension duration are required' });
    }

    const user = await UserSuspentionService.suspendUser(userId, days);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User suspended successfully',
      data: user,
    });
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    );
  }
};

const ReactivateUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserSuspentionService.reactivateUsers();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User reactivated successfully',
    data: result,
  });
});

const getAllSuspendedUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserSuspentionService.getUserStatus(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Suspended users retrived successfully',
    data: result,
  });
});

const getSuspendedUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserSuspentionService.getAllSuspendedUsers();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Suspended User reactivated successfully',
    data: result,
  });
});

const ActiveUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserSuspentionService.ActiveUser(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User reactivated successfully',
    data: result,
  });
});

export const UserSuspentionController = {
  suspendUserController,
  ReactivateUsers,
  getAllSuspendedUsers,
  getSuspendedUsers,
  ActiveUser,
};
