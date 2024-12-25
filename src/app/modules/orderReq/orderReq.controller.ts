import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderReqService } from './orderReq.service';
import { Request, Response } from 'express';
import ApiError from '../../../errors/ApiError';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const value = {
    ...req.body,
    userId: userId,
  };

  const result = await OrderReqService.createOrder(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order created successfully',
    data: result,
  });
});

const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  const { longitude, latitude, maxDistanceInMeters } = req.query;

  if (!longitude || !latitude) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Longitude and latitude are required'
    );
  }

  const parsedLongitude = parseFloat(longitude as string);
  const parsedLatitude = parseFloat(latitude as string);
  const parsedMaxDistance = maxDistanceInMeters
    ? parseInt(maxDistanceInMeters as string, 10)
    : 5000;

  if (isNaN(parsedLongitude) || isNaN(parsedLatitude)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Invalid longitude or latitude'
    );
  }

  const result = await OrderReqService.findUsersNearLocation(
    parsedLongitude,
    parsedLatitude,
    parsedMaxDistance
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const getOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderReqService.getAllOrder(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All Orders retrieved successfully',
    data: result,
  });
});

const getOrderHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const value = {
    ...req.query,
    userId: userId,
  };

  const result = await OrderReqService.getOrderHistory(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const getNearestAllOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderReqService.getNearestAllOrder(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Single Orders retrieved successfully',
    data: result,
  });
});

export const OrderReqController = {
  createOrder,
  getAllOrder,
  getOrderHistory,
  getOrder,
  getNearestAllOrder,
};
