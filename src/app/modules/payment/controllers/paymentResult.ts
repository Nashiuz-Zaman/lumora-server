import { clientUrl } from "@app/app";
import { catchAsync } from "@utils/catchAsync";
import { RequestHandler } from "express";

export const paymentResultController: RequestHandler = catchAsync(
  async (req, res) => {
    const { status, orderId } = req.query;

    const encoded = [status, orderId].map((el) =>
      encodeURIComponent(el as string)
    );

    return res.redirect(
      `${clientUrl}/payment-result?status=${encoded[0]}&orderId=${encoded[1]}`
    );
  }
);
