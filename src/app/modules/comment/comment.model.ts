import mongoose, { Schema } from 'mongoose';
import { IComment } from './comment.interface';

const commentSchema = new Schema<IComment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
    },
    comment: { type: String, required: true },
    delivery: {
      type: Schema.Types.ObjectId,
      ref: 'DeliveryCofirmation',
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
