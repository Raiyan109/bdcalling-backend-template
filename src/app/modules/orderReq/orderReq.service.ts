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

export const OrderReqService = {
  createOrder,
  findUsersNearLocation,
  getOrderHistory,
};
