import { model, Schema } from 'mongoose';
import { IPushNotification } from './pushNotification.interface';

export const pushNotificationSchema = new Schema<IPushNotification>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tokens: { type: [String], required: true },
  data: { type: Object },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
});

export const PushNotification = model<IPushNotification>(
  'PushNotification',
  pushNotificationSchema
);
