import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IDeliveryCofirmation } from './deliveryCofirmation.interface';
import { DeliveryCofirmation } from './deliveryCofirmation.model';
import { Order } from '../orderReq/orderReq.model';
import { Schedule } from '../deliveryTime/deliveryTime.model';
import { isTimeWithinRange } from '../../../shared/timeConvert';

// const createOrderConfirmed = async (payload: Partial<IDeliveryCofirmation>) => {
//   const isOrder = await Order.findById(payload.orderId);
//   if (!isOrder) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Order not found!');
//   }

//   const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
//   const currentTime = new Date().toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });

//   const schedule = await Schedule.findOne({ day: currentDay });

//   console.log(schedule);

//   if (!schedule || schedule.isOff) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Deliveries are off today.');
//   }

//   if (!isTimeWithinRange(currentTime, schedule.startTime, schedule.endTime)) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       `Deliveries allowed between ${schedule.startTime} and ${schedule.endTime} on ${currentDay}.`
//     );
//   }

//   const result = await DeliveryCofirmation.create(payload);

//   if (!result) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       'DeliveryCofirmation not created!'
//     );
//   }

//   if (result.status === 'delivered') {
//     const updatedOrder = await Order.findOneAndUpdate(
//       { _id: payload.orderId },
//       { $set: { status: 'completed' } },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       throw new ApiError(StatusCodes.BAD_REQUEST, 'Order not found!');
//     }
//   }

//   return result;
// };

const createOrderConfirmed = async (payload: Partial<IDeliveryCofirmation>) => {
  const isOrder = await Order.findById(payload.orderId);
  if (!isOrder) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Order not found!');
  }

  const isExistOrder = await DeliveryCofirmation.findOne({
    userId: payload.userId,
    orderId: isOrder._id,
  });
  if (isExistOrder) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You already have an order in progress'
    );
  }

  const isOrderNumberExist = await DeliveryCofirmation.findOne({
    userId: payload.userId,
    deliveryNumber: payload.deliveryNumber,
  });
  if (isOrderNumberExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Order with delivery number ${payload.deliveryNumber} already exists`
    );
  }

  const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const schedule = await Schedule.findOne({ day: currentDay });

  // If the schedule is null, allow creation without delivery time restrictions
  if (schedule) {
    if (schedule.isOff) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Deliveries are off today.');
    }

    if (!isTimeWithinRange(currentTime, schedule.startTime, schedule.endTime)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Deliveries allowed between ${schedule.startTime} and ${schedule.endTime} on ${currentDay}.`
      );
    }
  }

  const result = await DeliveryCofirmation.create(payload);

  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'DeliveryCofirmation not created!'
    );
  }

  if (result.status === 'delivered') {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: payload.orderId },
      { $set: { status: 'completed' } },
      { new: true }
    );

    if (!updatedOrder) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Order not found!');
    }
  }

  return result;
};

const getDeliveryHistory = async (query: Record<string, unknown>) => {
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
  const result = await DeliveryCofirmation.find(whereConditions)
    .populate({
      path: 'userId',
      select: 'driver',
      populate: {
        path: 'driver',
        select: 'firstName lastName',
      },
    })
    .populate({
      path: 'orderId',
    })

    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await DeliveryCofirmation.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

export const DeliveryCofirmationService = {
  createOrderConfirmed,
  getDeliveryHistory,
};
