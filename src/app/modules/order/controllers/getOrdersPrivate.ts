import { RequestHandler } from "express";
import {
  catchAsync,
  throwInternalServerError,
  sendSuccess,
} from "@utils/index";
import { fetchOrders } from "../services/fetchOrders";
import { ISecureRequest } from "@app/shared/types";

export const getOrdersPrivateController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const data = await fetchOrders(req.query);

    if (data)
      return sendSuccess(res, {
        data: { orders: data.orders, queryMeta: data.queryMeta },
      });

    return throwInternalServerError();
  }
);
