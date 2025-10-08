// core
import { RequestHandler } from "express";

// services
import { issueRefund } from "../service";

// utils
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
  toObjectId,
} from "@utils/index";

export const refundPaymentController: RequestHandler = catchAsync(
  async (req, res) => {
    const { id: _id } = req.params;
    const { reason } = req.body;

    const updatedPayment = await issueRefund(toObjectId(_id), reason);

    if (updatedPayment?._id)
      return sendSuccess(res, { message: "Refund Issued Successfully" });

    return throwInternalServerError();
  }
);
