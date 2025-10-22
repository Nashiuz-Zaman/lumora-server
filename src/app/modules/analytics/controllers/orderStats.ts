import { RequestHandler } from "express";
import { catchAsync, sendSuccess } from "@utils/index";
import { getOrderStats } from "../services";

export const orderStatsController: RequestHandler = catchAsync(
  async (req, res) => {
    const stats = await getOrderStats(req.query);
    sendSuccess(res, { data: { orderStats: stats } });
  }
);
