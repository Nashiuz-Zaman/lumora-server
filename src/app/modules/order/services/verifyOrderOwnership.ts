import { OrderModel } from "../order.model";
import { throwUnauthorized } from "@utils/index";

export const verifyOrderOwnership = async (
  orderIds: string[],
  userId: string
): Promise<void> => {
  const orders = await OrderModel.find({ _id: { $in: orderIds } })
    .select("user")
    .lean();

  if (!orders.length) {
    throwUnauthorized("Orders not found");
  }

  const unauthorized = orders?.some(
    (order) => order.user?.toString() !== userId
  );

  if (unauthorized) {
    return throwUnauthorized("You are not allowed to modify these orders");
  }
};
