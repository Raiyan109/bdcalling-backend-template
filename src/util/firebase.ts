/* eslint-disable @typescript-eslint/no-explicit-any */

import * as admin from 'firebase-admin';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const firebaseConfig = {
  type: 'service_account',
  project_id: 'push-notification-33a33',
  private_key_id: '6e20b7898b7c5f66bb48fd3f3d1c7f86ecb4012e',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0HRqrLDnsAhI5\nHCjKIjbls1jWZpnAVqkk9ZF1nLPxm1pDbYirZga+8rmzZM4U/Khkf38IiAsXNH+K\ntM6V79hEXDB4ZcUahO5FRys4CnOsU9HiKoCC0LOmHxg+gyGWWzV47GOHxaOZ0avF\nBjBVe8h3vFfHkupB7xCdxtDKK58qL2cRPilAojxAerrp1LwMlnqWgtZxpYIA7UXa\n3A4PKKnWzY/IueDxxvwKUOvchqqvfL6DeTBB0XBziH5DYjfc9dshVri+OykGd1qm\nXohGUzxYfM4+t/LWhEwe9tW8N+K0PkV1/DnnHYONO63KLDU1CdNfiLu7WiQYoAp8\nnaQbKiMTAgMBAAECggEAQvRwxgIOVCQe9xj3NtEKPFBz7Vu9uyjb/u/Ez4ZdxCp+\nnwM4Y5LtXg1oJ/6It3eG97kHlbnQ+aLb6Mm25DkBWcQ1hoQ6hdW1p45BzDbickTE\niIFJPZfsuIvlnNNtaHHmilnB1CaN3y/43SikThrSVmRu8zMznygKMsTGN+mIZQsS\nbeceL5lzgTvNP8yjZ6XXd6aJK4c1pcw2+hDDHriYsTLv8supSmCAbyrdXDR6f8ci\n8q/G2DsZJjmuUrza0fkTfatIivjRz5bK1M+R23bV0dMAPfFBpRI587xyHePD10kq\n/o0F6KxRuS2X02kLNfoMldOVvZbfiyX7M6yA9joq6QKBgQDwF+cfj8nSo/vZi3Bz\npMWXtQrEVD87WseX0WscMsE8GpeRSXs48BbpqbkYSISof8X4KhzzjGtKHAZoIBvK\nj3NoujlCv/324cBg59hOH/c+LxuOoeP4yLS8lkchs2rRVNPo8Mymm1qO71mw049I\n0CXidDDgpf/mz6CJmREG7eFSaQKBgQDAC+rk8ozWl7S+if7jsxZLmmNQbnxDE4Px\nnE7vD43w8z1dKSblmpNO6W9cLPE5pmD8ScpYKnFEuOBqda/mYeluMnDrCIRryn9l\nA3qCTr6gw+lmOtzGuXL0L0vXrIAcRjDn/sn4GhfjHEpE3oUFlNnpHPsgrlYqiep6\nh6kKtECiGwKBgAF5BA/rf99s5hSViGENN7EQiTpfEew5SFQkErYfkZPezeM0Qi89\nOcbBJcOCXl3yOrKk/3x29gmEVn25BLKfYqPX0JYaO2KSS+3MPkVsaMXW4CJl19Ik\n2Qb3HQSV5yfVj180auzyswGBclllUtGthS34bHxUSFeQGnn9mF8kgmdRAoGAWOsr\nryW+n/1N6orqQXNB929cXHlLf6MhjFTbF0UUa2O0HdZX9CdF3Vun+/2zEwY+EZH4\n5imAmFkhTyl+cCUVd7hTH/+pkF8J7TNXHc5n5PfQsUy/vCNRXk4nx4xPJMg7DK+j\nxAQQ207V9F0zKgppes24WMFflAKXVnRJiHM9GdECgYEAnMIjb1YC7j6KPBIJVPds\nF7Jb8UFw0KIm1ekECPQ1nriaMNRBNA7q7D9WX7a96LfG4ueNITIo3YKGhVJQ8c88\nH+DadxR9l+2bKwgWqhAfXI1hioewQWKe/gEjuI+4MYW/TKvpVTu5XCgJtNWGqYZi\natiw4qnGZjnGc9sYUUzN/nE=\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-aioyu@push-notification-33a33.iam.gserviceaccount.com',
  client_id: '101396711164378880725',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-aioyu%40push-notification-33a33.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
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
