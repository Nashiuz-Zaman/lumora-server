import { catchAsync, sendSuccess } from "@utils/index";
import { getTotalCustomers } from "../services";

export const totalCustomersController = catchAsync(async (_req, res) => {
  const totalCustomers = await getTotalCustomers();

  sendSuccess(res, {
    message: "Total customers retrieved successfully",
    data: { totalCustomers },
  });
});
