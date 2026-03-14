import { RequestHandler } from "express";
import { cancelOrders } from "../services/cancelOrders";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";
import { ISecureRequest } from "@app/shared/types";
import { verifyOrderOwnership } from "../services/verifyOrderOwnership";

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
