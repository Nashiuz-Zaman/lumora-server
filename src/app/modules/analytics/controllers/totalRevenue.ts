import { catchAsync, sendSuccess } from "@utils/index";
import { getTotalRevenue } from "../services";

export const totalRevenueController = catchAsync(async (_req, res) => {
  const revenue = await getTotalRevenue();

  sendSuccess(res, {
    message: "Total revenue retrieved successfully",
    data: { revenue },
  });
});
