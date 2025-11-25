import { RequestHandler } from "express";
import { cancelOrders } from "../services/cancelOrders";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { ISecureRequest } from "@app/shared/types";
import { verifyOrderOwnership } from "../services";

export const cancelOrdersCustomerController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { _ids } = req.body;
    const userId = req.decoded?.userId!;

    await verifyOrderOwnership(_ids, userId);
    const message = await cancelOrders(_ids, "Customer Cancelled");

    if (message) return sendSuccess(res, { message });
    return throwInternalServerError();
  }
);
