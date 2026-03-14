import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { getCustomerGrowthTrends } from "../services/getCustomerGrowth";

export const customerGrowthController = catchAsync(async (req, res) => {
  const data = await getCustomerGrowthTrends(req.query);

  sendSuccess(res, {
    data,
    message: "Customer growth trends fetched successfully",
  });
});
