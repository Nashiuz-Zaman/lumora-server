import { RequestHandler } from "express";
import { catchAsync, sendSuccess } from "@utils/index";
import { getOrderTrendsData } from "../services";

export const orderTrendsController: RequestHandler = catchAsync(
  async (req, res) => {
    const chartData = await getOrderTrendsData(req.query);

    sendSuccess(res, {
      data: chartData,
      message: "Line chart data for orders retrieved successfully",
    });
  }
);
