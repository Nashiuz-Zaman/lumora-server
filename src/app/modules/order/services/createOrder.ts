import { UserModel } from "@app/modules/user/user.model";
import { OrderModel } from "../order.model";
import { IOrder } from "../order.type";
import { throwNotFound } from "@utils/index";

export const createOrder = async (
  orderData: IOrder & { city?: string; zipCode?: string }
) => {
  if (!orderData.user) {
    const existingUser = await UserModel.findOne({ email: orderData.email })
      .select("_id")
      .lean();

    orderData.user = existingUser?._id || "guest";
  }

  // Create the order
  const order = await OrderModel.create(orderData);

  if (!order?._id) return throwNotFound("Order could not be created");

  return order;
};
