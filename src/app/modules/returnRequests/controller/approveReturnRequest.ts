import { RequestHandler } from "express";
import { approveReturnRequest } from "../services/approveReturnRequest";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";

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
