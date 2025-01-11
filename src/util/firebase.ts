// /* eslint-disable @typescript-eslint/no-explicit-any */

// import * as admin from 'firebase-admin';
// import ApiError from '../errors/ApiError';
// import { StatusCodes } from 'http-status-codes';

// const firebaseConfig = {
//   type: 'service_account',
//   project_id: 'notification-69041',
//   private_key_id: 'ad7ca3ccca206b3e899221307d7fe9c2ecbf46a7',
//   private_key:
//     '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDS5myXfwJXwu5S\nOqzBLmry/VSQkGHOt5axGIqJm0cjjKPF8Lv8S1julPUxh9rUQjxfD7bTJSJymMwt\nmCf1fMvEyWD+krG9wXGFLWJgqZGSnAg7c645fwlsh6LhsBDTU5jTFqUMfZUVoStm\nMAakF+ATuEx+6gCzLsYVCcrBmEhS0G0SHetoAoqRY00u3P6M4q4kS58eVGwuyYvo\nayx3O6qzg6mFhUJmGhaKIbk20tMvyYum+ho8mrvTHPyuMYgM3zHo866gOMP3Qd6s\nbZPyKNfAXXw8pURiZfwp3y7cPGdNNY3NgigpcYEMBJHTE77QM7bMOrhGLsVGGzza\nQwD+SI2dAgMBAAECggEAHjE/OBQGe5ZsRGjifPh+dqF2Rwjoe63UPK+4+5i3fzsd\n4hND8ks+JM+953SdyxfdaTWIdKNjEllWF6vqAo62ZEp5IJDTMcl9DTYRWKnF7aF5\nWzuFJHWPnZIwaxNn4T0dSpD6GXbsDi/n1OYIuVqyqVgP2XZ6GazXTkE73enFZtdt\nyFZuAJWk6AHn7tByuY4lt8nUz6E14ixd83HDkgSFUW9grRCtYeCtPrmlBo5WI1R5\nij4zBnh0DG4/y109UqBumhquXF83GoLqrzC+9CthhSfPQbs2XeGNS2oiMbKBKnK3\nmTSaCKA0rMt6M2WwEw61n112oI9mL5WlBqH2l9ovgQKBgQDwdvUxmMWZG1tEhPbk\nDy0lFv+/cEta5YlPv6iecs3gxdzbdLV18eCj78jnydr/pcJ1oV+X8UOJEvp6HWLO\nbcP5KVrfcqEGbjsN63txWrTTqIgQ3mxS/VwdhWUqgxfQ7JkUSIEUVv07AynB80dZ\n7cpwqnrhvuiodsoMFxAC6dFIgQKBgQDghn+EzNN8GEpFbDBfrGsuerCPxK6N2tAF\nDCpo+C6WFIO4MOdOfRqvyWIp0Y9g8urJoUgZZ2lGP817aCvrr/Y8ln9DnihCUHTO\nFyZQmO5duaYG2o6I++HYA1R9UslqmxZfJnDMaNh/t1y7e08IBKPZ5RBdX39kUaT7\nP3i6bi/XHQKBgCATXiWdgU4pDgWXzu8g7x6xcK/ypLqdP7G5mR55pejDu/AyIzp2\nZ0a254+zp1jOnZ/fRMcZ0a5pL6w2W0W58pg74flIax5Wed4jeTXnqZNKOcw2PzDa\nxvzRHGuNTRH7XXgNK9qwt9q1U06hyvS9+XEJ7JZMRvCh19XBBcu9sMMBAoGATpgm\nOTlt6mmiTgziHgt/9WQzPBBQPg3TdYDds6L0w8polWhg/8OhPNmUyCi4NOqzr2MK\nlwHxAwtAhatgfH87Bdh0shnB4/y/9oh5/AqcnihnaszEykTJuNDpmXkKUov5V9Nf\n9t3Ys1RfXK18a8UcCiE6CkVslZRS2TRNsYzyqC0CgYBmKnQ+UPfArXmywXqZKuTB\n2RW+g49h97P/pxJzg+g0heVBmvRtIZguP4kXJIc39vC1qha8pwAbiyjDe8+TWquv\nfUL+yHqiFRFEFRLrK9Idjh+8niF6e67JlBvh08bcjdtcQ2NDyR+yQmjDRQ+X8XNP\nUcci6NmEpeJAkFvKanlL0w==\n-----END PRIVATE KEY-----\n',
//   client_email:
//     'firebase-adminsdk-d26x5@notification-69041.iam.gserviceaccount.com',
//   client_id: '110647605390238161577',
//   auth_uri: 'https://accounts.google.com/o/oauth2/auth',
//   token_uri: 'https://oauth2.googleapis.com/token',
//   auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
//   client_x509_cert_url:
//     'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-d26x5%40notification-69041.iam.gserviceaccount.com',
//   universe_domain: 'googleapis.com',
// };

// // console.log(firebaseConfig, 'firebaseConfig');
// admin.initializeApp({
//   credential: admin.credential.cert(firebaseConfig as any),
// });

// type NotificationPayload = {
//   title: string;
//   body: string;
//   data?: { [key: string]: string };
// };

// export const sendNotification = async (
//   fcmToken: string[],
//   payload: NotificationPayload
// ): Promise<any> => {
//   try {
//     const response = await admin.messaging().sendEachForMulticast({
//       tokens: fcmToken,

//       notification: {
//         title: payload.title,
//         body: payload.body,
//       },

//       apns: {
//         headers: {
//           'apns-push-type': 'alert',
//         },
//         payload: {
//           aps: {
//             badge: 1,
//             sound: 'default',
//           },
//         },
//       },
//     });

//     return response;
//   } catch (error: any) {
//     // eslint-disable-next-line no-console
//     console.error('Error sending message:', error.error);
//     if (error?.code === 'messaging/third-party-auth-error') {
//       // console.error('Skipping iOS token due to auth error:', error);
//       return null;
//     } else {
//       // eslint-disable-next-line no-console
//       console.error('Error sending message:', error);
//       throw new ApiError(
//         StatusCodes.NOT_IMPLEMENTED,
//         'Failed to send notification'
//       );
//     }
//   }
// };
