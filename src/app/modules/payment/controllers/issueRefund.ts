// core
import { RequestHandler } from "express";

// services
import { issueRefund } from "../service/issueRefund";

// utils
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";
import { toObjectId } from "@utils/objectIdUtils";

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
