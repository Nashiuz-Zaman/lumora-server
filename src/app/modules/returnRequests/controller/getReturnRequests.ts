import { RequestHandler } from "express";
import { catchAsync, sendSuccess } from "@utils/index";
import { getReturnRequests } from "../services";

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
