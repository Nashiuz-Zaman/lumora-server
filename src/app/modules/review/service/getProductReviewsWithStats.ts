import { ReviewModel } from "../review.model";
import { QueryBuilder } from "@app/classes/QueryBuilder";
import { ReviewStatus } from "../review.constants";
import { toObjectId, throwBadRequest } from "@utils/index";

export const getProductReviewsWithStats = async (
  queryObj: Record<string, any>
) => {
  const productId = queryObj.product;
  if (!productId) return throwBadRequest("Product ID is required");

  const objectId = toObjectId(productId);

  // Compute review stats
  const statsResult = await ReviewModel.aggregate([
    { $match: { product: objectId, status: ReviewStatus.Approved } },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
        totalRating: { $sum: "$rating" },
      },
    },
  ]);

  // Default stats
  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalReviews = 0;
  let ratingSum = 0;

  statsResult.forEach(({ _id, count, totalRating }) => {
    if (ratingCounts[_id] !== undefined) {
      ratingCounts[_id] = count;
      totalReviews += count;
      ratingSum += totalRating;
    }
  });

  const averageRating = totalReviews > 0 ? ratingSum / totalReviews : 0;

  const ratingPercentages: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  for (let i = 1; i <= 5; i++) {
    ratingPercentages[i] = totalReviews
      ? Number(((ratingCounts[i] / totalReviews) * 100).toFixed(2))
      : 0;
  }

  // --- Fetch paginated reviews ---
  const queryObjWithStatus = { ...queryObj, status: ReviewStatus.Approved };
  const query = new QueryBuilder(ReviewModel, queryObjWithStatus);
  const reviews =
    (await query.filter().sort().limitFields().paginate().exec()) || [];
  const queryMeta = (await query.getQueryMeta()) || {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  };

  return {
    stats: {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews,
      ratingCounts,
      ratingPercentages,
    },
    reviews,
    queryMeta,
  };
};
