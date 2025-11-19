import { RequestHandler } from "express";
import { catchAsync, sendSuccess, toObjectId } from "@utils/index";
import { getOrders } from "../services/getOrders";
import { ISecureRequest } from "@app/shared/types";

export const getOrdersForCustomerController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const userId = toObjectId(req.decoded?.userId!);
    const queryObj = {
      ...req.query,
      userId,
      limitFields:
        "orderId,createdAt,status,items,subtotal,shippingFee,tax,discount,total",
    };
    const data = await getOrders(queryObj);

    return sendSuccess(res, {
      data: { orders: data.orders, queryMeta: data.queryMeta },
    });
  }
);
