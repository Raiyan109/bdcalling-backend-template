import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { DeliveryCofirmationService } from './deliveryCofirmation.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import getFilePath from '../../../shared/getFilePath';

const createDeliveryCofirmation = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    let image = getFilePath(req.files, 'images');

    const value = {
      ...req.body,
      userId: userId,
      image,
    };

    const result = await DeliveryCofirmationService.createOrderConfirmed(value);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Delivery cofirmation created successfully',
      data: result,
    });
  }
);

const getDeliveryHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const value = {
    ...req.body,
    userId: userId,
  };

  const result = await DeliveryCofirmationService.getDeliveryHistory(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Delivery history retrived successfully',
    data: result,
  });
});

export const DeliveryCofirmationController = {
  createDeliveryCofirmation,
  getDeliveryHistory,
};
