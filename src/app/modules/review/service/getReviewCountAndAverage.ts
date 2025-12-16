import { Types } from "mongoose";
import { ReviewModel } from "../review.model";
import { ReviewStatus } from "../review.constants";
import { hasElements } from "@utils/hasElements";

type TReturnValue = {
  productId: Types.ObjectId;
  totalReviews: number;
  averageRating: number;
}[];

export const getReviewCountAndAverage = async (
  productIds: Types.ObjectId[]
): Promise<TReturnValue> => {
  if (!hasElements(productIds)) return [];

  const stats = await ReviewModel.aggregate([
    {
      $match: {
        product: { $in: productIds },
        status: ReviewStatus.Approved,
      },
    },
    {
      $group: {
        _id: "$product",
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        totalReviews: 1,
        averageRating: { $round: ["$averageRating", 1] },
      },
    },
  ]);

  return stats;
};
