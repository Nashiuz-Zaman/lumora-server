import { PaymentType } from "@app/modules/payment/payment.constant";
import { PaymentModel } from "@app/modules/payment/payment.model";
import { throwInternalServerError } from "@utils/index";

export const getTotalRevenue = async (): Promise<number> => {
  const result = await PaymentModel.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: {
            $cond: [
              { $eq: ["$type", PaymentType.payment] },
              "$amount",
              { $multiply: ["$amount", -1] }, // subtract refunds
            ],
          },
        },
      },
    },
  ]);

  const totalRevenue = result[0]?.totalRevenue ?? 0;
  if (typeof totalRevenue !== "number") return throwInternalServerError();
  
  return totalRevenue;
};
