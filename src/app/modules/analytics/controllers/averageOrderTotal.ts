import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { getAverageOrderTotal } from "../services/getAverageOrderTotal";

export const averageOrderTotalController = catchAsync(async (_req, res) => {
  const averageOrderTotal = await getAverageOrderTotal();

  sendSuccess(res, {
    message: "Average order total retrieved successfully",
    data: { averageOrderTotal },
  });
});
