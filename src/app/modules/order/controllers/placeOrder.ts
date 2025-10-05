import { RequestHandler } from "express";

import { createOrder } from "../services";
import { initiateOrderPayment } from "@app/modules/payment/service";
import {
  getServerUrl,
  throwInternalServerError,
  sendSuccess,
  catchAsync,
} from "@utils/index";

export const placeOrderController: RequestHandler = catchAsync(
  async (req, res) => {
    const orderData = req.body;
    const serverUrl = getServerUrl(req);

    const order = await createOrder(orderData);
    const paymentUrl = await initiateOrderPayment(order, serverUrl);

    if (paymentUrl) return sendSuccess(res, { data: { paymentUrl } });

    return throwInternalServerError();
  }
);
