import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { bulkApproveReviews } from "../service/bulkApproveReviews";
import { throwBadRequest } from "@utils/operationalErrors";

export const bulkApproveReviewsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return throwBadRequest("Review IDs are required");
    }

    const result = await bulkApproveReviews(ids);

    sendSuccess(res, {
      message: `${result.modifiedCount} review(s) approved successfully`,
    });
  }
);
