import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { OrderTypeService } from './orderType.service';
import sendResponse from '../../../shared/sendResponse';

const createOrderTypeToDb = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderTypeService.createOrderTypeToDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order type created successfully',
    data: result,
  });
});

export const OrderTypeController = {
  createOrderTypeToDb,
};
