import { RequestHandler } from "express";
import { rejectReturnRequest } from "../services/rejectReturnRequest";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";

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
