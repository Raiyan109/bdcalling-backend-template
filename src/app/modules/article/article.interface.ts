import { Types } from 'mongoose';

export type IArticle = {
  title: string;
  description: string;
  image: string;

  category: Types.ObjectId;
};
