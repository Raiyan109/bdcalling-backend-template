import { model, Schema } from 'mongoose';
import { IOrderReq } from './orderReq.interface';

const orderSchema = new Schema<IOrderReq>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  orderDetails: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  quantity: { type: Number, required: true },

  type: { type: Schema.Types.ObjectId, ref: 'OrderType', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['inProgress', 'completed', 'cancelled'],
    default: 'inProgress',
  },
  rating: { type: Number },
  count: { type: String },
});

orderSchema.index({ location: '2dsphere' });

export const Order = model<IOrderReq>('Order', orderSchema);
