import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IInformativeVideo } from './informativeVideo.interface';
import { InformativeVideo } from './informativeVideo.model';
import unlinkFile from '../../../shared/unlinkFile';

const createInformativeVideo = async (payload: Partial<IInformativeVideo>) => {
  const result = await InformativeVideo.create(payload);

  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'InformativeVideo not created!'
    );
  }

  return result;
};

const getAllInformativeVideo = async (query: Record<string, unknown>) => {
  const { searchTerm, name, page, limit, ...filterData } = query;
  const anyConditions: any[] = [];

  // Filter by additional filterData fields
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  // Combine all conditions
  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Fetch campaigns
  const result = await InformativeVideo.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await InformativeVideo.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const getSingleInformativeVideo = async (id: string) => {
  const result = await InformativeVideo.findById(id).lean();

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'InformativeVideo not found!');
  }

  return result;
};

const updateInformationVideo = async (
  id: string,
  payload: Partial<IInformativeVideo>
) => {
  const isExist = await InformativeVideo.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'InformativeVideo not found!');
  }

  if (payload.video && isExist.video) {
    unlinkFile(isExist.video);
  }

  const result = await InformativeVideo.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteInformativeVideo = async (id: string) => {
  const isExist = await InformativeVideo.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'InformativeVideo not found!');
  }

  if (isExist.video) {
    unlinkFile(isExist.video);
  }

  const result = await InformativeVideo.findByIdAndDelete(id);
  return result;
};

export const InformativeVideoService = {
  createInformativeVideo,
  getAllInformativeVideo,
  getSingleInformativeVideo,
  updateInformationVideo,
  deleteInformativeVideo,
};
