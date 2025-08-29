import { ReviewModel } from "../review.model";
import { ReviewStatus } from "../review.constants";
import { throwNotFound } from "@utils/operationalErrors";

/**
 * Approves multiple reviews by setting their status to Approved.
 * @param reviewIds - An array of review IDs to approve.
 */
export const bulkApproveReviews = async (reviewIds: string[]) => {
  const result = await ReviewModel.updateMany(
    { _id: { $in: reviewIds } },
    { $set: { status: ReviewStatus.Approved } }
  );

  if (result.matchedCount === 0)
    throwNotFound("No matching reviews found to approve");

  return result;
};
