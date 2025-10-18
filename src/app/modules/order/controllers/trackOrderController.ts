import { trackOrder } from "../services";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { RequestHandler } from "express";

export const trackOrderController: RequestHandler = catchAsync(
  async (req, res) => {
    const { orderId } = req.params;
    const order = await trackOrder(orderId);
    return sendSuccess(res, { data: { order } });
  }
);
