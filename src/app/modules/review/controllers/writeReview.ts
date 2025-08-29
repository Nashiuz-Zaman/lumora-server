import { RequestHandler } from "express";

// import { ISecureRequest } from "@shared/type/secureRequest";
import { catchAsync } from "@utils/catchAsync";
import { writeReviewService } from "../service/createReview";
import { sendSuccess } from "@utils/sendSuccess";

export const writeReviewController: RequestHandler = catchAsync(
  async (req, res) => {
    const reviewData = req.body;

    const newReview = await writeReviewService(reviewData);

    if (newReview._id)
      return sendSuccess(res, {
        code: 201,
        message: "Thank you for the review",
      });
  }
);
