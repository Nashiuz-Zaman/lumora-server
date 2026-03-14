import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { getPaymentStats } from "../services/getPaymentStats";

export const paymentStatsController: RequestHandler = catchAsync(
  async (req, res) => {
    const stats = await getPaymentStats(req.query);

    sendSuccess(res, { data: { paymentStats: stats } });
  }
);
