import { RequestHandler } from "express";
import { cancelOrders } from "../services/cancelOrders";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";

export const cancelOrdersAdminController: RequestHandler = catchAsync(
  async (req, res) => {
    const { _ids, reason } = req.body;
    const message = await cancelOrders(_ids, reason);

    if (message) return sendSuccess(res, { message });

    return throwInternalServerError();
  }
);
