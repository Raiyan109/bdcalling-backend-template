import { Types } from 'mongoose';

export type IWishlist = {
  user: Types.ObjectId;
  article: Types.ObjectId;
};
