import { OrderModel } from "@app/modules/order/order.model";
import { OrderStatus } from "@app/modules/order/order.constants";
import { throwInternalServerError } from "@utils/index";

export const getAverageOrderTotal = async (): Promise<number> => {
  const result = await OrderModel.aggregate([
    {
      $match: {
        status: { $nin: [OrderStatus.Pending, OrderStatus.Cancelled] },
      },
    },
    {
      $group: {
        _id: null,
        averageTotal: { $avg: "$total" },
      },
    },
  ]);

  const average = result[0]?.averageTotal ?? 0;

  if (typeof average !== "number") return throwInternalServerError();

  return average;
};
