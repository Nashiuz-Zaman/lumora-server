import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { toObjectId } from "@utils/objectIdUtils";
import { getOrders } from "../services/getOrders";
import { ISecureRequest } from "@app/shared/types";

export const getOrdersForCustomerController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const userId = toObjectId(req.decoded?.userId!);

    const queryObj = {
      ...req.query,
      user: userId,
      limitFields:
        "orderId,createdAt,status,items,subtotal,shippingFee,tax,discount,total,invoice",
    };

    const data = await getOrders(queryObj);

    return sendSuccess(res, {
      data: { orders: data.orders, queryMeta: data.queryMeta },
    });
  }
);
