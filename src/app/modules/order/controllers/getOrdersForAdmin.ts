import { RequestHandler } from "express";
import {
  catchAsync,
  throwInternalServerError,
  sendSuccess,
} from "@utils/index";
import { getOrders } from "../services/getOrders";
import { ISecureRequest } from "@app/shared/types";

export const getOrdersPrivateController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const data = await getOrders(req.query);

    if (data)
      return sendSuccess(res, {
        data: { orders: data.orders, queryMeta: data.queryMeta },
      });

    return throwInternalServerError();
  }
);
