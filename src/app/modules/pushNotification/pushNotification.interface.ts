import { Types } from 'mongoose';

export type IPushNotification = {
  title: string;
  body: string;
  tokens: string[];
  data?: Record<string, string>;
  userId: Types.ObjectId;
  status: 'sent' | 'failed';
};
