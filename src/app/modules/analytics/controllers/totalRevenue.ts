import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { getTotalRevenue } from "../services/getTotalRevenue";

export const totalRevenueController = catchAsync(async (_req, res) => {
  const revenue = await getTotalRevenue();

  sendSuccess(res, {
    message: "Total revenue retrieved successfully",
    data: { revenue },
  });
});
