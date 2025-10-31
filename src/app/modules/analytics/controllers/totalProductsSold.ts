import { catchAsync, sendSuccess } from "@utils/index";
import { getTotalProductsSold } from "../services";

export const totalProductsSoldController = catchAsync(async (_req, res) => {
  const totalProductsSold = await getTotalProductsSold();

  sendSuccess(res, {
    message: "Total products sold retrieved successfully",
    data: { totalProductsSold },
  });
});
