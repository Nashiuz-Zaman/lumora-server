import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { getOrderTrendsData } from "../services/getOrderPlacedTrend";
import { getOrderCancelledTrend } from "../services/getOrderCancelledTrend";

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
