/* eslint-disable @typescript-eslint/no-explicit-any */

import * as admin from 'firebase-admin';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const firebaseConfig = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// console.log(firebaseConfig, 'firebaseConfig');
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig as any),
});

type NotificationPayload = {
  title: string;
  body: string;
  data?: { [key: string]: string };
};

export const sendNotification = async (
  fcmToken: string[],
  payload: NotificationPayload
): Promise<any> => {
  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens: fcmToken,

      notification: {
        title: payload.title,
        body: payload.body,
      },

      apns: {
        headers: {
          'apns-push-type': 'alert',
        },
        payload: {
          aps: {
            badge: 1,
            sound: 'default',
          },
        },
      },
    });

    return response;
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error sending message:', error.error);
    if (error?.code === 'messaging/third-party-auth-error') {
      // console.error('Skipping iOS token due to auth error:', error);
      return null;
    } else {
      // eslint-disable-next-line no-console
      console.error('Error sending message:', error);
      throw new ApiError(
        StatusCodes.NOT_IMPLEMENTED,
        'Failed to send notification'
      );
    }
  }
};
