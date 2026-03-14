import { getPayments } from "@app/modules/payment/service/getPayments";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";

export const recentPaymentsController = catchAsync(async (req, res) => {
  const { payments } = await getPayments({
    ...req.query,
    limit: 10,
    sort: "-createdAt",
    limitFields: "orderId,customerName,amount,status",
  });

  sendSuccess(res, {
    message: "Recent payments retrieved successfully",
    data: payments,
  });
});
