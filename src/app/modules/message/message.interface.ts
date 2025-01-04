import { Types } from 'mongoose';

export type IMessage = {
  senderId: Types.ObjectId;
  recieverId: Types.ObjectId;
  message: String;
};