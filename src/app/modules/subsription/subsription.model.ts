import { model, Schema } from 'mongoose';
import { ISubscription } from './subsription.interface';


const subscriptionSchema = new Schema<ISubscription>(
  {
    status: {
      type: String,
      // enum: ['expired', 'active', 'incomplete', 'cancellation_requested'],
    },
    customerId: {
      type: String,
    },
    plan: {
      type: String,
    },
    subscriptionId: {
      type: String,
    },
    priceId: {
      type: String,
    },
    priceAmount: {
      type: Number,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    packages: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
    },

    clientSecret: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    currentPeriodEnd: {
      type: String,
    },
    currentPeriodStart: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = model<ISubscription>(
  'subscription',
  subscriptionSchema
);