import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IArticle } from './article.interface';
import { Article } from './article.model';
import { Category } from '../category/category.model';
import unlinkFile from '../../../shared/unlinkFile';

const createArticaleToDB = async (payload: Partial<IArticle>) => {
  const isCategoryExist = await Category.findById(payload.category);

  if (!isCategoryExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category not found!');
  }

  const createArticale = await Article.create(payload);

  if (!createArticale) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Articale not created!');
  }

  return createArticale;
};

const getAllArticle = async (query: Record<string, unknown>) => {
  const { searchTerm, page, limit, ...filterData } = query;
  const anyConditions: any[] = [{ status: 'active' }];

  // Add searchTerm condition if present
  if (searchTerm) {
    const categoriesIds = await Category.find({
      name: { $regex: searchTerm, $options: 'i' },
    }).distinct('_id');

    if (categoriesIds.length > 0) {
      anyConditions.push({ category: { $in: categoriesIds } });
    }
  }

  // Filter by additional filterData fields
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  // Combine all conditions
  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Fetch Category data
  const result = await Article.find(whereConditions)
    .populate({
      path: 'category',
      select: 'name',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Article.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const getSingleArticle = async (id: string) => {
  const result = await Article.findById(id).populate({
    path: 'category',
    select: 'name',
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Article not found!');
  }

  return result;
};

const updateArticle = async (id: string, payload: Partial<IArticle>) => {
  const isExist = await Article.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Article not found!');
  }

  if (payload.image && isExist.image) {
    unlinkFile(isExist.image);
  }

  const result = await Article.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteArticle = async (id: string) => {
  const result = await Article.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Article not found!');
  }

  return result;
};

export const ArticleService = {
  createArticaleToDB,
  getAllArticle,
  getSingleArticle,
  updateArticle,
  deleteArticle,
};
