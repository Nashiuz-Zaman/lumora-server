import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { getRevenueTrendsData } from "../services/getRevenueTrendsData";

export const revenueTrendsController: RequestHandler = catchAsync(
  async (req, res) => {
    const chartData = await getRevenueTrendsData(req.query);

    sendSuccess(res, {
      data: chartData,
      message: "Line chart data for revenue retrieved successfully",
    });
  }
);
