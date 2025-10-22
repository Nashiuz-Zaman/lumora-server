import { RequestHandler } from "express";
import { catchAsync, sendSuccess } from "@utils/index";
import { getPaymentStats } from "../services";

export const paymentStatsController: RequestHandler = catchAsync(
  async (req, res) => {
    const stats = await getPaymentStats(req.query);

    sendSuccess(res, { data: { paymentStats: stats } });
  }
);
