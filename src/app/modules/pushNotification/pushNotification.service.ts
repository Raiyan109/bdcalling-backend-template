import { sendNotification } from '../../../util/firebase';
import { IPushNotification } from './pushNotification.interface';
import { PushNotification } from './pushNotification.model';

const sendNotifications = async (payload: IPushNotification) => {
  const { tokens, title, body, data, userId } = payload;

  try {
    // Validate request data
    if (!tokens || !tokens.length || !title || !body || !userId) {
      throw new Error('Missing required fields');
    }

    // Send push notification
    const notification = await sendNotification(tokens, { title, body, data });

    const result = await PushNotification.create({
      title,
      body,
      tokens,
      data,
      userId,
      status: notification.error ? 'failed' : 'sent',
    });

    console.log(result, 'result');

    return notification;
  } catch (error) {
    // Error handling
    console.error('Error sending push notification:', error);
    throw error;
  }
};

export const PushNotificationService = { sendNotifications };
