import { OrderModel } from "../order.model";
import { throwNotFound, toObjectId } from "@utils/index";
import { OrderStatus } from "../order.constants";

export const updateShippingDetails = async (
  _id: string,
  details: {
    shippingTrackingNumber: string;
    shippingCarrier: string;
    estimatedDelivery: string;
  }
) => {
  const order = await OrderModel.findById(toObjectId(_id));

  if (!order) {
    return throwNotFound("Order not found");
  }

  order.status = OrderStatus.Shipped;
  order.shippingTrackingNumber = details.shippingTrackingNumber;
  order.shippingCarrier = details.shippingCarrier;
  order.estimatedDelivery = new Date(details.estimatedDelivery);
  order.activities.push({ status: OrderStatus.Shipped, time: new Date() });

  const newOrder = await order.save();

  if (newOrder._id) return newOrder;
};
