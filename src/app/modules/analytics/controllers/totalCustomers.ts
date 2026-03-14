import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { getTotalCustomers } from "../services/getTotalCustomers";

export const totalCustomersController = catchAsync(async (_req, res) => {
  const totalCustomers = await getTotalCustomers();

  sendSuccess(res, {
    message: "Total customers retrieved successfully",
    data: { totalCustomers },
  });
});
