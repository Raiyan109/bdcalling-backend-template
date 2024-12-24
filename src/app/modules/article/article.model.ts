import mongoose, { Schema } from 'mongoose';
import { IArticle } from './article.interface';

const articaleSchema = new mongoose.Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

articaleSchema.pre('save', async function (next) {
  const isExist = await Article.findOne({ title: this.title });
  if (isExist) {
    throw new Error('Article already exist please change the title!');
  }
  next();
});

export const Article = mongoose.model<IArticle>('Article', articaleSchema);
