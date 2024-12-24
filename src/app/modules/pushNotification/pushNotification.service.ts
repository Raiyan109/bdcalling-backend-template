import { sendNotification } from '../../../util/firebase';
import { IPushNotification } from './pushNotification.interface';

const sendNotifications = async (payload: IPushNotification) => {
  const { tokens, title, body, data, userId } = payload;

  try {
    // Validate request data
    if (!tokens || !tokens.length || !title || !body || !userId) {
      throw new Error('Missing required fields');
    }

    // Send push notification
    const notification = await sendNotification(tokens, { title, body, data });

    return notification;
  } catch (error) {
    // Error handling
    console.error('Error sending push notification:', error);
    throw error;
  }
};

export const PushNotificationService = { sendNotifications };
