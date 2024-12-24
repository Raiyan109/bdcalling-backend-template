import { Types } from 'mongoose';

export type IReview = {
  rating: number;
  review: string;
  user: Types.ObjectId;
  order: Types.ObjectId;
  status: 'active' | 'delete';
};
