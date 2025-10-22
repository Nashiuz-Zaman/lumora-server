import { PaymentStatus } from "@app/modules/payment/payment.constant";
import { PaymentModel } from "@app/modules/payment/payment.model";

export const getTotalRevenue = async () => {
  const result = await PaymentModel.aggregate([
    {
      $match: { status: PaymentStatus.Paid },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  return result[0]?.totalRevenue || 0;
};
