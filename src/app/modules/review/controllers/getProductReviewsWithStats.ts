import { RequestHandler } from "express";
import { getProductReviewsWithStats } from "../service/getProductReviewsWithStats";
import { sendSuccess } from "@utils/sendSuccess";
import { catchAsync } from "@utils/catchAsync";

export const getProductReviewsWithStatsController: RequestHandler = catchAsync(
  async (req, res) => {
    const queryObj = { ...req.query };
    const { productId } = req.params;

    queryObj.product = productId;
    const data = await getProductReviewsWithStats(queryObj);

    sendSuccess(res, {
      data,
      message: "Product reviews fetched successfully",
    });
  }
);
