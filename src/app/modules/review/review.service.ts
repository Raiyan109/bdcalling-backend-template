import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';

import { IReview } from './review.interface';
import { Review } from './review.model';
import { Order } from '../orderReq/orderReq.model';

const createReviewToDB = async (payload: Partial<IReview>) => {
  // Check if the review already exists
  const isExist = await Review.findOne({
    order: payload.order,
    user: payload.user,
  });

  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Review already exists');
  }

  const result = await Review.create(payload);

  if (!result) {
    return 'Review not created!';
  }

  const reviews = await Review.find({ order: payload.order });

  const totalRatings = reviews.reduce(
    (sum, review) => sum + (review.rating || 0),
    0
  );
  const reviewCount = reviews.length;
  //   const averageRating = totalRatings / reviewCount;
  const averageRating = Math.round(totalRatings / reviewCount);

  await Order.updateOne(
    { _id: payload.order },
    {
      $set: {
        rating: averageRating,
        count: reviewCount,
      },
    }
  );

  return result;
};

export const ReviewService = {
  createReviewToDB,
};
