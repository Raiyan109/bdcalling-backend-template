import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { DeliveryTimeService } from './deliveryTime.service';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';

const setSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await DeliveryTimeService.setSchedule(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Schedule set successfully',
    data: result,
  });
});

const setDayOff = catchAsync(async (req: Request, res: Response) => {
  const { day } = req.body;

  const result = await DeliveryTimeService.setDayOff(day);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Schedule of day set successfully',
    data: result,
  });
});

const removeDayOff = catchAsync(async (req: Request, res: Response) => {
  const { day } = req.body;

  const result = await DeliveryTimeService.removeDayOff(day);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Schedule removed of day successfully',
    data: result,
  });
});

const getSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await DeliveryTimeService.getAllSchedule();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Schedule retrived successfully',
    data: result,
  });
});

export const DeliveryTimeController = {
  setSchedule,
  getSchedule,
  setDayOff,
  removeDayOff,
};
