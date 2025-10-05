// core
import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";

// Services / helpers
import { getPayment } from "../service/getPayment";
import { handleRefundWithSave } from "../helpers/handleRefundWithSave";

// Utils
import {
  catchAsync,
  sendSuccess,
  throwBadRequest,
  throwInternalServerError,
} from "@utils/index";

export const issueRefundController: RequestHandler = catchAsync(
  async (req, res) => {
    const _id = req.params.id;
    const { reason } = req.body;

    if (!_id) return throwBadRequest("Payment _id not found");

    const payment = await getPayment({ _id });

    const updatedPayment = await handleRefundWithSave(
      payment!,
      uuidv4(),
      reason
    );

    if (updatedPayment?._id)
      return sendSuccess(res, { message: "Refund Issued Successfully" });

    return throwInternalServerError("Error issuing refund");
  }
);
