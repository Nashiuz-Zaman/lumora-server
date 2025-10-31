import { catchAsync, sendSuccess } from "@utils/index";
import { getTopCategorySalesPercentage } from "../services";

export const topCategorySalesPercentageController = catchAsync(
  async (_req, res) => {
    const result = await getTopCategorySalesPercentage();

    sendSuccess(res, {
      message: "Top category sales percentages retrieved successfully",
      data: result,
    });
  }
);
