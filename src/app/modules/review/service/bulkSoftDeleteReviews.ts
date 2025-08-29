import { throwNotFound } from "@utils/operationalErrors";
import { ReviewStatus } from "../review.constants";
import { ReviewModel } from "../review.model";

/**
 * Soft-deletes multiple reviews by setting their status to Deleted.
 * @param reviewIds - An array of review IDs to delete.
 */
export const bulkDeleteReviews = async (reviewIds: string[]) => {
  const result = await ReviewModel.updateMany(
    { _id: { $in: reviewIds } },
    { $set: { status: ReviewStatus.Deleted } }
  );

  if (result.matchedCount === 0)
    throwNotFound("No matching reviews found to delete");

  return result;
};
