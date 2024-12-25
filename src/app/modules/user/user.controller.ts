import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const value = {
      ...req.body,
    };

    await UserService.createClientToDB(value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        'Please check your email to verify your account. We have sent you an OTP to complete the registration process.',
    });
  }
);
const createDriverToDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const value = {
      ...req.body,
    };

    await UserService.createDriverToDB(value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        'Please check your email to verify your account. We have sent you an OTP to complete the registration process.',
    });
  }
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    let image;
    if (req.files && 'image' in req.files && req.files.image[0]) {
      image = `/images/${req.files.image[0].filename}`;
    }

    const value = {
      image,
      ...req.body,
    };

    console.log(value);

    const result = await UserService.updateProfileToDB(user, value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getSingleUser(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User retrived successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  getUserProfile,
  updateProfile,
  getSingleUser,
  createDriverToDB,
};
