import { OrderModel } from "@app/modules/order/order.model";
import { OrderStatus } from "@app/modules/order/order.constants";
import { throwInternalServerError } from "@utils/index";

export const getTotalProductsSold = async (): Promise<number> => {
  const result = await OrderModel.aggregate([
    {
      // Exclude pending and cancelled orders
      $match: {
        status: { $nin: [OrderStatus.Pending, OrderStatus.Cancelled] },
      },
    },
    {
      // Flatten items array
      $unwind: "$items",
    },
    {
      // Sum up all item quantities
      $group: {
        _id: null,
        totalSold: { $sum: "$items.quantity" },
      },
    },
  ]);

  const totalSold = result[0]?.totalSold ?? 0;

  if (typeof totalSold !== "number") return throwInternalServerError();

  return totalSold;
};
