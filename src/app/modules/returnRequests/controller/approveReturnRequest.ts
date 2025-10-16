import { RequestHandler } from "express";
import { approveReturnRequest } from "../services";
import { catchAsync, sendSuccess } from "@utils/index";

export const approveReturnRequestController: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const { refundAmount } = req.body;
    
    await approveReturnRequest(id, refundAmount);

    return sendSuccess(res, {
      message: "Return Request Approved",
    });
  }
);
