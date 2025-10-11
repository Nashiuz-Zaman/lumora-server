import { clientUrl } from "index";
import { OrderModel } from "@app/modules/order/order.model";
import { catchAsync } from "@utils/catchAsync";
import { RequestHandler } from "express";

export const paymentResultController: RequestHandler = catchAsync(
  async (req, res) => {
    const { status, orderId } = req.query;

    console.log("coming from payment result route", req.body);
    console.log("coming from payment result route",req.headers);

    if (status !== "success") {
      await OrderModel.deleteOne({ orderId });
    }

    const encoded = [status, orderId].map((el) =>
      encodeURIComponent(el as string)
    );

    return res.redirect(
      `${clientUrl}/payment-result?status=${encoded[0]}&orderId=${encoded[1]}`
    );
  }
);
