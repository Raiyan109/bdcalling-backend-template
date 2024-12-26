import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IComment } from './comment.interface';
import { Comment } from './comment.model';
import { Driver } from '../driver/driver.model';
import { DeliveryCofirmation } from '../deliveryCofirmation/deliveryCofirmation.model';

const createCommentToDB = async (payload: Partial<IComment>) => {
  const isDriver = await Driver.findOne({ userId: payload.userId });
  if (!isDriver) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Driver not found!');
  }

  const isDelivery = await DeliveryCofirmation.findById(payload.delivery);
  if (!isDelivery) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Delivery not found!');
  }

  const isExist = await Comment.findOne({
    delivery: payload.delivery,
    userId: payload.userId,
  });
  //   if (isExist) {
  //     throw new ApiError(StatusCodes.BAD_REQUEST, 'Comment already exists');
  //   }

  const value = {
    ...payload,
    delivery: isDelivery._id,
    userId: isDriver._id,
  };

  const result = await Comment.create(value);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Comment not created!');
  }

  return result;
};

const getAllComment = async (query: Record<string, unknown>) => {
  const { searchTerm, status, page, limit, deliveryId, ...filterData } = query;
  const anyConditions: any[] = [];

  if (searchTerm) {
    anyConditions.push({
      $or: [
        { status: { $regex: searchTerm, $options: 'i' } },
        { comment: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }

  if (deliveryId) {
    anyConditions.push({ delivery: deliveryId });
  }

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

  const result = await Comment.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Comment.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const getSingleComment = async (id: string) => {
  const result = await Comment.findById(id)
    .populate({
      path: 'delivery',
    })
    .populate({
      path: 'userId',
      select: 'firstName lastName image email',
    });

  return result;
};

export const CommentService = {
  createCommentToDB,
  getSingleComment,
  getAllComment,
};
