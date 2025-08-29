// controllers/markHelpful.ts

import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { markReviewHelpful } from "../service/markReviewHelpful";
import { RequestHandler } from "express";
import { ISecureRequest } from "@app/shared/types";

export const markReviewHelpfulController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { reviewId } = req.params;
    const { userId } = req.decoded!;

    await markReviewHelpful(reviewId, userId!);

    sendSuccess(res, {
      message: "Marked as helpful",
    });
  }
);
