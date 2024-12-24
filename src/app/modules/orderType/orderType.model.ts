import mongoose from 'mongoose';
import { IType } from './orderType.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const typeSchema = new mongoose.Schema<IType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'delete'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

typeSchema.pre('save', async function (next) {
  const isExist = await OrderType.findOne({ name: this.name });
  if (isExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Order type already exist please change the name!'
    );
  }
  next();
});

export const OrderType = mongoose.model<IType>('OrderType', typeSchema);
