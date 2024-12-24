import { Schema, model } from 'mongoose';
import { IDeliveryCofirmation } from './deliveryCofirmation.interface';

const deliverySchema = new Schema<IDeliveryCofirmation>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: { type: String },
  image: { type: String },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  problemOccurred: [{ type: String }],
  status: {
    type: String,
    enum: ['delivered', 'not-delivered', 'problem-occurred'],
    default: 'delivered',
  },
});

export const DeliveryCofirmation = model<IDeliveryCofirmation>(
  'DeliveryCofirmation',
  deliverySchema
);
