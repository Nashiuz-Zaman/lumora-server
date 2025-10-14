import { RequestHandler } from "express";
import { getReturnRequest } from "../services";
import { catchAsync, sendSuccess } from "@utils/index";

export const getReturnRequestController: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const { populate, limitFields } = req.query;

    const returnRequest = await getReturnRequest(
      { _id: id },
      {
        populate: populate as string,
        limitFields: limitFields as string,
      }
    );

    return sendSuccess(res, { data: { returnRequest } });
  }
);
