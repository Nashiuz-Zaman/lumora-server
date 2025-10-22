import { RequestHandler } from "express";
import { catchAsync, sendSuccess } from "@utils/index";
import { getRevenueTrendsData } from "../services";

export const revenueTrendsController: RequestHandler = catchAsync(
  async (req, res) => {
    const chartData = await getRevenueTrendsData(req.query);

    sendSuccess(res, {
      data: chartData,
      message: "Line chart data for revenue retrieved successfully",
    });
  }
);
