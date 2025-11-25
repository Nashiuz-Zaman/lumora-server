import { RequestHandler } from "express";
import { cancelOrders } from "../services/cancelOrders";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

export const cancelOrdersAdminController: RequestHandler = catchAsync(
  async (req, res) => {
    const { _ids, reason } = req.body;
    const message = await cancelOrders(_ids, reason);

    if (message) return sendSuccess(res, { message });

    return throwInternalServerError();
  }
);
