import { Types } from 'mongoose';

export type IOrderReq = {
  userId: string;
  orderDetails: string;
  location: {
    type: { type: String; enum: ['Point']; default: 'Point' };
    coordinates: [number, number];
  };
  quantity: number;
  type: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  status: 'inProgress' | 'completed' | 'cancelled';
  rating?: number;
  count?: string;
};
