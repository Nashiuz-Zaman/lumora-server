import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { getTotalProductsSold } from "../services/getTotalProductsSold";

export const totalProductsSoldController = catchAsync(async (_req, res) => {
  const totalProductsSold = await getTotalProductsSold();

  sendSuccess(res, {
    message: "Total products sold retrieved successfully",
    data: { totalProductsSold },
  });
});
