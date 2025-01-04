import { Types } from 'mongoose';

export type IConversation = {
  participants: [Types.ObjectId];
  messages: [Types.ObjectId];
};