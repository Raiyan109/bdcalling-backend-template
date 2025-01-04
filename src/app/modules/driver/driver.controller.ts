import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { DriverService } from './driver.service';
import sendResponse from '../../../shared/sendResponse';

const updateDriverProfile = catchAsync(async (req: Request, res: Response) => {
    let image;
    if (req.files && 'image' in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }

    const value = {
        image,
        ...req.body,
    };

    const result = await DriverService.updateDriverProfile(req.params.id, value);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Driver profile updated successfully',
        data: result,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await DriverService.getAllUsers(req.query);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Driver retrived successfully',
        data: result,
    });
});

export const DriverController = {
    updateDriverProfile,
    getAllUsers,
};