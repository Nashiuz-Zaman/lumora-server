import { throwBadRequest } from "@utils/operationalErrors";
import { ReviewModel } from "../review.model";

import { IWriteReviewInput } from "../review.type";

export const writeReviewService = async (data: IWriteReviewInput) => {
  const { name, title, product, rating, comment } = data;

  if (!rating || !product || !name || !title) {
    throwBadRequest("Rating and product are required");
  }

  // const existing = await ReviewModel.findOne({ user, product });
  // if (existing) {
  //   throwBadRequest("You have already reviewed this product");
  // }

  const newReview = await ReviewModel.create({
    name,
    title,
    product,
    rating,
    comment,
  });

  return newReview;
};
