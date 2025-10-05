import { OrderModel } from "../order.model";
import { formatDateTime, throwNotFound } from "@utils/index";

export const trackOrder = async (orderId: string) => {
  const order = await OrderModel.findOne({ orderId });

  if (!order) return throwNotFound(`Order with ID ${orderId} not found`);

  return {
    orderId: order.orderId,
    items: order.items,
    total: order.total,
    placedAt: order.createdAt,
    status: order.status,
    activities: order.activities,
    name: order.name,
    deliveryAddress: order.deliveryAddress,
    phone: order.phone,
    email: order.email,
    estimatedDelivery: order?.estimatedDelivery
      ? formatDateTime(order.estimatedDelivery.toISOString())
      : "Not shipped yet",
  };
};
