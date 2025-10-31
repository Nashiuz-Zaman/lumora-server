import { RequestHandler } from "express";
import { catchAsync, sendSuccess } from "@utils/index";
import { getOrderTrendsData, getOrderCancelledTrend } from "../services";

export const orderTrendsCombinedController: RequestHandler = catchAsync(
  async (req, res) => {
    const [placedTrends, cancelledTrends] = await Promise.all([
      getOrderTrendsData(req.query),
      getOrderCancelledTrend(req.query),
    ]);

    sendSuccess(res, {
      data: {
        placedTrends,
        cancelledTrends,
      },
      message: "Order trends (placed & cancelled) retrieved successfully",
    });
  }
);
