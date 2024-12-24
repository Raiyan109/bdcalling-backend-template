import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ArticleService } from './article.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import getFilePath from '../../../shared/getFilePath';

const createArticle = catchAsync(async (req: Request, res: Response) => {
  let image = getFilePath(req.files, 'images');

  const value = {
    image,
    ...req.body,
  };

  const result = await ArticleService.createArticaleToDB(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Article created successfully',
    data: result,
  });
});

const getAllArticle = catchAsync(async (req: Request, res: Response) => {
  const result = await ArticleService.getAllArticle(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Article retrived successfully',
    data: result,
  });
});

const getSingleArticle = catchAsync(async (req: Request, res: Response) => {
  const result = await ArticleService.getSingleArticle(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Single Article retrived successfully',
    data: result,
  });
});

const updatedArticle = catchAsync(async (req: Request, res: Response) => {
  let image;
  if (req.files && 'image' in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  const value = {
    image,
    ...req.body,
  };

  const result = await ArticleService.updateArticle(req.params.id, value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Article updated successfully',
    data: result,
  });
});

const deleteArticle = catchAsync(async (req: Request, res: Response) => {
  const result = await ArticleService.deleteArticle(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Article deleted successfully',
    data: result,
  });
});

export const ArticleController = {
  createArticle,
  getAllArticle,
  getSingleArticle,
  updatedArticle,
  deleteArticle,
};
