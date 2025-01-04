import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';

import sendResponse from '../../../shared/sendResponse';
import { ClientService } from './client.service';

const updateClientProfile = catchAsync(async (req: Request, res: Response) => {
  let image;
  if (req.files && 'image' in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  const value = {
    image,
    ...req.body,
  };

  const result = await ClientService.updateClientProfile(req.params.id, value);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Client profile updated successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await ClientService.getAllUsers(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Client retrived successfully',
    data: result,
  });
});

export const ClientController = {
  updateClientProfile,
  getAllUsers,
};