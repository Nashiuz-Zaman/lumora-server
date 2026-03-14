import { RequestHandler } from "express";
import { placeOrder } from "../services/placeOrder";
import { getServerUrl } from "@utils/getServerUrl";
import { throwInternalServerError } from "@utils/operationalErrors";
import { sendSuccess } from "@utils/sendSuccess";
import { catchAsync } from "@utils/catchAsync";
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
