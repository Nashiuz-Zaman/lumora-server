import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { bulkApproveReviews } from "../service/bulkApproveReviews";
import { throwBadRequest } from "@utils/operationalErrors";
import { hasElements } from "@utils/hasElements";

export const bulkApproveReviewsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { ids } = req.body;

    if (!hasElements(ids)) {
      return throwBadRequest("Review IDs are required");
    }

    const result = await bulkApproveReviews(ids);

    sendSuccess(res, {
      message: `${result.modifiedCount} review(s) approved successfully`,
    });
  }
);
