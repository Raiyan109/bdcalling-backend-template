import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IType } from './orderType.interface';
import { OrderType } from './orderType.model';

const createOrderTypeToDB = async (payload: Partial<IType>) => {
  const result = await OrderType.create(payload);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'OrderType not created!');
  }

  return result;
};

export const OrderTypeService = {
  createOrderTypeToDB,
};
