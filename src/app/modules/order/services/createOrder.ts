import { ClientSession } from "mongoose";
import { UserModel } from "@app/modules/user/user.model";
import { OrderModel } from "../order.model";
import { IOrder } from "../order.type";
import { toObjectId } from "@utils/objectIdUtils";

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
    // Type assertion is needed since the data is coming from client and the user is currently a string type
    orderData.user = toObjectId(orderData.user as string);
  }

  // Create the order (with session if provided)
  let newOrder = new OrderModel(orderData);

  newOrder = await newOrder.save({ session });

  if (newOrder._id) return newOrder;
};
