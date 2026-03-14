import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { getOrderStats } from "../services/getOrderStats";

export const orderStatsController: RequestHandler = catchAsync(
  async (req, res) => {
    const stats = await getOrderStats(req.query);
    sendSuccess(res, { data: { orderStats: stats } });
  }
);
