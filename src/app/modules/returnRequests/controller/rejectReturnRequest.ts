import { RequestHandler } from "express";
import { rejectReturnRequest } from "../services";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

export const rejectReturnRequestController: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;

    const updatedRequest = await rejectReturnRequest(id);

    if (updatedRequest._id)
      return sendSuccess(res, {
        message: "Return Request Rejected",
      });

    return throwInternalServerError();
  }
);
