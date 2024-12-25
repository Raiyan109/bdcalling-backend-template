import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IDeliveryTime } from './deliveryTime.interface';
import { Schedule } from './deliveryTime.model';
import { sendNotifications } from '../../../helpers/notificationHelper';

const setSchedule = async (scheduleData: Partial<IDeliveryTime>) => {
  const { day, startTime, endTime, isOff } = scheduleData;

  if (!day) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Day is required');
  }

  const schedule = await Schedule.findOneAndUpdate(
    { day },
    { startTime, endTime, isOff },
    { new: true, upsert: true }
  );

  const value = {
    text: `Delivery time for ${day} is updated to ${startTime} to ${endTime}`,
    type: 'DRIVER',
  };

  if (schedule) {
    sendNotifications(value);
  }

  return schedule;
};

const getAllSchedule = async () => {
  const schedule = await Schedule.find();

  if (!schedule) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Schedule not found');
  }

  return schedule;
};

const setDayOff = async (day: string) => {
  const schedule = await Schedule.findOneAndUpdate(
    { day },
    { isOff: true },
    { new: true }
  );

  if (!schedule) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Schedule for the day not found');
  }

  return schedule;
};

const removeDayOff = async (day: string) => {
  const schedule = await Schedule.findOneAndUpdate(
    { day },
    { isOff: false },
    { new: true }
  );

  if (!schedule) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Schedule for the day not found');
  }

  return schedule;
};

export const DeliveryTimeService = {
  setSchedule,
  getAllSchedule,
  setDayOff,
  removeDayOff,
};
