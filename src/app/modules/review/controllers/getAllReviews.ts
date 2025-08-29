// controllers/review.controller.ts
import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { getReviews } from "../service/getReviews";

export const getAllReviewsController: RequestHandler = catchAsync(
  async (req, res) => {
    const queryObj = req.query;
    const { reviews, queryMeta } = await getReviews(queryObj);

    sendSuccess(res, {
      data: {
        reviews,
        meta: queryMeta,
      },
      message: "Reviews fetched successfully",
    });
  }
);
