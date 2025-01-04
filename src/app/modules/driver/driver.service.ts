import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import { IDriver } from './driver.interface';
import { Driver } from './driver.model';
import { USER_ROLES } from '../../../enums/user';
import { User } from '../user/user.model';

const updateDriverProfile = async (id: string, payload: Partial<IDriver>) => {
    const isExist = await Driver.findById(id);
    if (!isExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Driver not found!');
    }

    if (payload.image && isExist.image) {
        unlinkFile(isExist.image);
    }

    const result = await Driver.findByIdAndUpdate(id, payload, { new: true });
    return result;
};

const getAllUsers = async (query: Record<string, unknown>) => {
    const { page, limit, searchTerm, ...filterData } = query;
    const anyConditions: any[] = [{ status: 'active' }];

    if (searchTerm) {
        const categoriesIds = await Driver.find({
            firstName: { $regex: searchTerm, $options: 'i' },
        }).distinct('_id');

        if (categoriesIds.length > 0) {
            anyConditions.push({ driver: { $in: categoriesIds } });
        }
    }

    // Filter by additional filterData fields
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.entries(filterData).map(
            ([field, value]) => ({ [field]: value })
        );
        anyConditions.push({ $and: filterConditions });
    }

    anyConditions.push({ role: USER_ROLES.DRIVER });

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
        .populate('driver')
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

export const DriverService = {
    updateDriverProfile,
    getAllUsers,
};