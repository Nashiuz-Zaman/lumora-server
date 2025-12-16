import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwBadRequest } from "@utils/operationalErrors";
import { bulkDeleteReviews } from "../service/bulkSoftDeleteReviews";
import { hasElements } from "@utils/hasElements";

export const bulkDeleteReviewsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { ids } = req.body;

    if (!hasElements(ids)) {
      return throwBadRequest("Review IDs are required");
    }

    const result = await bulkDeleteReviews(ids);

    sendSuccess(res, {
      message: `${result.modifiedCount} review(s) deleted successfully`,
    });
  }
);
