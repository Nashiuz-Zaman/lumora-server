import { catchAsync, sendSuccess } from "@utils/index";
import { getAverageOrderTotal } from "../services";

export const averageOrderTotalController = catchAsync(async (_req, res) => {
  const averageOrderTotal = await getAverageOrderTotal();

  sendSuccess(res, {
    message: "Average order total retrieved successfully",
    data: { averageOrderTotal },
  });
});
