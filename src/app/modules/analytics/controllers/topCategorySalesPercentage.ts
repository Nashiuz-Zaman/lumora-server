import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { getTopCategorySalesPercentage } from "../services/getTopCategorySalesPercentage";

export const topCategorySalesPercentageController = catchAsync(
  async (req, res) => {
    const result = await getTopCategorySalesPercentage(req.query);

    sendSuccess(res, {
      message: "Top category sales percentages retrieved successfully",
      data: result,
    });
  }
);
