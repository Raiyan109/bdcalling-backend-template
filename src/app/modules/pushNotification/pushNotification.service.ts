import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { sendNotification } from '../../../util/firebase';
import { IPushNotification } from './pushNotification.interface';
import { PushNotification } from './pushNotification.model';
import { User } from '../user/user.model';

const sendNotifications = async (payload: IPushNotification) => {
  const { title, body, data, userId } = payload;

  try {
    // Validate request data
    if (!title || !body || !userId) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Missing required fields: ${title} ${body} ${userId} ${data}`
      );
    }

    // Fetch users with valid fcmToken
    const usersWithTokens = await User.find({
      fcmToken: { $exists: true, $ne: null },
    });

    console.log(usersWithTokens);

    if (!usersWithTokens.length) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'No users with valid FCM tokens found.'
      );
    }

    // Extract tokens
    const tokens: any = usersWithTokens?.map(user => user.fcmToken);

    // Send push notification
    const notification = await sendNotification(tokens, { title, body, data });

    // Log results into PushNotification collection
    const result = await PushNotification.create({
      title,
      body,
      tokens,
      data,
      userId,
      status: notification.error ? 'failed' : 'sent',
    });

    return notification;
  } catch (error) {
    // Error handling
    console.error('Error sending push notification:', error);
    throw error;
  }
};

export const PushNotificationService = { sendNotifications };
