import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwBadRequest } from "@utils/operationalErrors";
import { bulkDeleteReviews } from "../service/bulkSoftDeleteReviews";

export const bulkDeleteReviewsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return throwBadRequest("Review IDs are required");
    }

    const result = await bulkDeleteReviews(ids);

    sendSuccess(res, {
      message: `${result.modifiedCount} review(s) deleted successfully`,
    });
  }
);
