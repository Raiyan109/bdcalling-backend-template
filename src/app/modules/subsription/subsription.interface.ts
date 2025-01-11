import { Types } from 'mongoose';

export type ISubscription = {
  customerId: string;
  plan: string;
  status: string;
  priceAmount: number;
  user: Types.ObjectId;
  packages: Types.ObjectId;
  priceId: string | null;
  transactionId: string | null;
  subscriptionId: string | null;
  clientSecret: string | null;
  currentPeriodEnd: Date | null;
  currentPeriodStart: Date | null;
};