import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { getFilePathMultiple } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { InformativeVideoService } from './informativeVideo.service';
import { StatusCodes } from 'http-status-codes';

const createInformativeVideoIntoDb = catchAsync(
  async (req: Request, res: Response) => {
    const value = {
      ...req.body,
    };

    let video = getFilePathMultiple(req.files, 'media', 'media');

    if (video && video.length > 0) {
      value.video = video[0];
    }

    const result = await InformativeVideoService.createInformativeVideo(value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'InformativeVideo created successfully',
      data: result,
    });
  }
);

const getAllInformativeVideo = catchAsync(
  async (req: Request, res: Response) => {
    const result = await InformativeVideoService.getAllInformativeVideo(
      req.query
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'InformativeVideo retrived successfully',
      data: result,
    });
  }
);
const getSingleInformativeVideo = catchAsync(
  async (req: Request, res: Response) => {
    const result = await InformativeVideoService.getSingleInformativeVideo(
      req.params.id
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Single InformativeVideo retrived successfully',
      data: result,
    });
  }
);

const updateInformationVideo = catchAsync(
  async (req: Request, res: Response) => {
    const value = {
      ...req.body,
    };

    let video = getFilePathMultiple(req.files, 'media', 'media');

    if (video && video.length > 0) {
      value.video = video[0];
    }

    const result = await InformativeVideoService.updateInformationVideo(
      req.params.id,
      value
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'InformativeVideo updated successfully',
      data: result,
    });
  }
);

const deleteInformativeVideo = catchAsync(
  async (req: Request, res: Response) => {
    const result = await InformativeVideoService.deleteInformativeVideo(
      req.params.id
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'InformativeVideo deleted successfully',
      data: result,
    });
  }
);

export const InformativeVideoController = {
  createInformativeVideoIntoDb,
  getAllInformativeVideo,
  getSingleInformativeVideo,
  updateInformationVideo,
  deleteInformativeVideo,
};
