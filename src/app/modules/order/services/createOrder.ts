import { ClientSession } from "mongoose";
import { UserModel } from "@app/modules/user/user.model";
import { OrderModel } from "../order.model";
import { IOrder } from "../order.type";
import { toObjectId } from "@utils/index";

export const createOrder = async (
  orderData: IOrder & { city?: string; zipCode?: string },
  session?: ClientSession
) => {
  if (!orderData.user) {
    const existingUser = await UserModel.findOne({ email: orderData.email })
      .select("_id")
      .lean()
      .session(session || null);

    orderData.user = existingUser?._id || "guest";
  } else {
    if ((orderData.user as string).trim() !== "guest") {
      orderData.user = toObjectId(orderData.user as string);
    }else {
      orderData.user = 'guest'
    }
  }

  // Create the order (with session if provided)
  let newOrder = new OrderModel(orderData);

  newOrder = await newOrder.save({ session });

  if (newOrder._id) return newOrder;
};
