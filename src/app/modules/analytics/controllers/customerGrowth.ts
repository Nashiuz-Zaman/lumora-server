import { catchAsync, sendSuccess } from "@utils/index";
import { getCustomerGrowthTrends } from "../services";

export const customerGrowthController = catchAsync(async (req, res) => {
  const data = await getCustomerGrowthTrends(req.query);

  sendSuccess(res, {
    data,
    message: "Customer growth trends fetched successfully",
  });
});
