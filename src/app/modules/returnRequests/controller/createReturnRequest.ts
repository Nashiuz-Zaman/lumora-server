import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { createReturnRequest } from "../services/createReturnRequest";

export const createReturnRequestController: RequestHandler = catchAsync(
  async (req, res) => {
    await createReturnRequest(req.body);

    return sendSuccess(res, {
      message: "Return request submitted",
    });
  }
);
