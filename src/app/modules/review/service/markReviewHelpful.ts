import {
  throwBadRequest,
  throwNotFound,
} from "../../../../utils/operationalErrors";
// services/review.service.ts

import { ReviewModel } from "../review.model";
import { toObjectId } from "@utils/toObjectId";

export const markReviewHelpful = async (reviewId: string, userId: string) => {
  const review = await ReviewModel.findById(reviewId);
  if (!review) return throwNotFound("Review not found");

  const userObjectId = toObjectId(userId);
  const alreadyMarked = review.helpfulBy?.some(
    (uid) => uid.toString() === userObjectId.toString()
  );

  if (alreadyMarked) {
    return throwBadRequest("You have already marked this review as helpful");
  }

  review.helpfulBy?.push(userObjectId);
  await review.save();

  return {
    helpfulCount: review.helpfulBy?.length,
    markedHelpful: true,
  };
};
