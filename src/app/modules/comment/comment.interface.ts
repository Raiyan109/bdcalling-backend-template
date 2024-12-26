import { Types } from 'mongoose';

export type IComment = {
  userId: Types.ObjectId;
  comment: string;
  delivery: Types.ObjectId;
};
