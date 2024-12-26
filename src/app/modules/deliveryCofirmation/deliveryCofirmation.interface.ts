import { Types } from 'mongoose';

export type IDeliveryCofirmation = {
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  status: 'delivered' | 'not-delivered' | 'problem-occurred';
  image: string;
  comment: string;
  deliveryNumber: string;
  // problemOccurred?: string[];
};
