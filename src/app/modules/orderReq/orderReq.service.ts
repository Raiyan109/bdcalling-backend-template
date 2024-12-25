import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IOrderReq } from './orderReq.interface';
import { Order } from './orderReq.model';
import { User } from '../user/user.model';
import { sendNotifications } from '../../../helpers/notificationHelper';

const createOrder = async (payload: IOrderReq) => {
  const requiredFields: (keyof IOrderReq)[] = [
    'userId',
    'orderDetails',
    'location',
    'quantity',
    'type',
  ];
  const missingFields = requiredFields.filter(field => !payload[field]);

  if (missingFields.length > 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Missing required fields: ${missingFields.join(', ')}`
    );
  }

  const isOrderExist = await Order.findOne({
    userId: payload.userId,
    orderDetails: payload.orderDetails,
  });

  if (isOrderExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You already have an order in progress'
    );
  }

  const isUserExist: any = await User.findOne({ _id: payload.userId });

  if (!isUserExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  if (isUserExist.isSuspended === true) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Your account is suspended');
  }

  const order = await Order.create(payload);

  const value = {
    receiver: payload.userId,
    text: 'Your request sending successfully',
  };

  if (order.status === 'inProgress') {
    sendNotifications(value);
  }

  return order;
};

const findUsersNearLocation = async (
  longitude: number,
  latitude: number,
  maxDistanceInMeters = 5000
) => {
  try {
    const orders = await Order.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistanceInMeters,
        },
      },
    });

    return orders;
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Error finding users near location'
    );
  }
};

const getAllOrder = async (query: Record<string, unknown>) => {
  const { searchTerm, page, limit, ...filterData } = query;
  const anyConditions: any[] = [];

  // Filter by additional filterData fields
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  anyConditions.push({ status: { $ne: 'completed' } });

  // Combine all conditions
  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Fetch Category data
  const result = await Order.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Order.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const getOrderHistory = async (query: Record<string, unknown>) => {
  const { searchTerm, status, page, limit, userId, ...filterData } = query;
  const anyConditions: any[] = [];

  if (status) {
    anyConditions.push({ status: status });
  }

  // Add searchTerm condition for other fields if present
  if (searchTerm) {
    anyConditions.push({
      $or: [{ status: { $regex: searchTerm, $options: 'i' } }],
    });
  }

  if (userId) {
    anyConditions.push({ userId: userId });
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

  // Fetch campaigns
  const result = await Order.find(whereConditions)
    .populate({
      path: 'type',
      select: 'name',
    })
    .select('-location')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Order.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const getNearestAllOrder = async (orderId: string) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'This user does not have any orders'
    );
  }

  const longitude = order.location.coordinates[0];
  const latitude = order.location.coordinates[1];

  const orders = await Order.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        distanceField: 'distance',
        spherical: true,
        distanceMultiplier: 0.001,
      },
    },
    {
      $match: {
        _id: order._id,
      },
    },
    {
      $lookup: {
        from: 'ordertypes',
        localField: 'type',
        foreignField: '_id',
        as: 'type',
      },
    },
    {
      $unwind: {
        path: '$type',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        type: 1,
        orderDetails: 1,
        quantity: 1,
        location: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  return orders;
};

export const OrderReqService = {
  createOrder,
  findUsersNearLocation,
  getOrderHistory,
  getAllOrder,
  getNearestAllOrder,
};
