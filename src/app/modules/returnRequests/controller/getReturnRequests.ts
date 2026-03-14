import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { getReturnRequests } from "../services/getReturnRequests";

export const getReturnRequestsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { returnRequests, queryMeta } = await getReturnRequests(req.query);

    return sendSuccess(res, {
      data: {
        returnRequests,
        queryMeta,
      },
    });
  }
);
