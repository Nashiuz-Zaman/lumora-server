import { OrderStatus } from "../order.constants";
import { OrderModel } from "../order.model";
import { throwBadRequest, toObjectId } from "@utils/index";

export const getUserOrderStats = async (userId: string) => {
  if (!userId) return throwBadRequest("User ID not provided");
  const objectId = toObjectId(userId);

  const [totalOrders, pendingOrders, completedOrders] = await Promise.all([
    OrderModel.countDocuments({ user: objectId }),
    OrderModel.countDocuments({
      user: objectId,
      status: {
        $in: [OrderStatus["Confirmed"]],
      },
    }),
    OrderModel.countDocuments({
      user: objectId,
      status: OrderStatus.Delivered,
    }),
  ]);

  return { totalOrders, pendingOrders, completedOrders };
};
