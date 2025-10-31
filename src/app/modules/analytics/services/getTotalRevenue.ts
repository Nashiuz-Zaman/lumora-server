import { OrderModel } from "@app/modules/order/order.model";
import { OrderStatus } from "@app/modules/order/order.constants";
import { throwInternalServerError } from "@utils/index";

export const getTotalRevenue = async (): Promise<number> => {
  const result = await OrderModel.aggregate([
    {
      $match: {
        status: {
          $nin: [
            OrderStatus.Pending,
            OrderStatus.Returned,
            OrderStatus.Cancelled,
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total" },
      },
    },
  ]);

  const totalRevenue = result[0]?.totalRevenue ?? 0;

  if (typeof totalRevenue !== "number") return throwInternalServerError();

  return totalRevenue;
};
