import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { sendNotifications } from '../../../helpers/notificationHelper';

const suspendUser = async (userId: string, days: number) => {
  const suspensionEndDate = new Date();
  suspensionEndDate.setDate(suspensionEndDate.getDate() + days);

  const user = await User.findByIdAndUpdate(
    userId,
    { isSuspended: true, suspensionEndDate },
    { new: true }
  );

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const value = {
    receiver: userId,
    text: `Your account has been suspended for ${days} days.`,
  };

  if (user) {
    sendNotifications(value);
  }

  return user;
};

const reactivateUsers = async () => {
  const now = new Date();
  const users = await User.updateMany(
    { isSuspended: true, suspensionEndDate: { $lte: now } },
    { isSuspended: false, suspensionEndDate: null }
  );

  if (users.matchedCount === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No suspended users found');
  }

  return users;
};

const getUserStatus = async (userId: string) => {
  const user = await User.findById(userId).populate('driver client');

  if (!user) {
    throw new Error('User not found');
  }

  return {
    isSuspended: user.isSuspended,
    suspensionEndDate: user.suspensionEndDate,
    user,
  };
};

const getAllSuspendedUsers = async () => {
  const users = await User.find({ isSuspended: true }).populate(
    'driver client'
  );

  if (users.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No suspended users found');
  }

  return users;
};

const ActiveUser = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isSuspended: false, suspensionEndDate: null },
    { new: true }
  );

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const value = {
    receiver: userId,
    text: `Your account has been reactivated.`,
  };

  if (user) {
    sendNotifications(value);
  }

  return user;
};

export const UserSuspentionService = {
  suspendUser,
  reactivateUsers,
  getUserStatus,
  ActiveUser,
  getAllSuspendedUsers,
};
