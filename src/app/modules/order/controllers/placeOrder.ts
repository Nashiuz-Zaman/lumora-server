import { RequestHandler } from "express";
import { placeOrder } from "../services";
import {
  getServerUrl,
  throwInternalServerError,
  sendSuccess,
  catchAsync,
} from "@utils/index";
import { IOrder } from "../order.type";

export const placeOrderController: RequestHandler = catchAsync(
  async (req, res) => {
    const orderData = req.body as IOrder;
    const serverUrl = getServerUrl(req);

    const paymentUrl = await placeOrder(orderData, serverUrl);
    if (paymentUrl) return sendSuccess(res, { data: { paymentUrl } });

    return throwInternalServerError();
  }
);
