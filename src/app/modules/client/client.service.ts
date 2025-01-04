import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IClient } from './client.interface';
import { Client } from './client.model';
import unlinkFile from '../../../shared/unlinkFile';
import { User } from '../user/user.model';
import { USER_ROLES } from '../../../enums/user';

const updateClientProfile = async (id: string, payload: Partial<IClient>) => {
  const isExist = await Client.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Client not found!');
  }

  if (payload.image && isExist.image) {
    unlinkFile(isExist.image);
  }

  const result = await Client.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const anyConditions: any[] = [{ status: 'active' }];

  // Add searchTerm condition if present
  if (searchTerm) {
    const categoriesIds = await Client.find({
      firstName: { $regex: searchTerm, $options: 'i' },
    }).distinct('_id');

    if (categoriesIds.length > 0) {
      anyConditions.push({ client: { $in: categoriesIds } });
    }
  }

  // Filter by additional filterData fields
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  anyConditions.push({ role: USER_ROLES.CLIENT });

  anyConditions.push({ role: { $ne: USER_ROLES.ADMIN } });

  anyConditions.push({ verified: true });

  // Combine all conditions
  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Fetch campaigns
  const result = await User.find(whereConditions)
    .populate('client')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await User.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

export const ClientService = {
  updateClientProfile,
  getAllUsers,
};