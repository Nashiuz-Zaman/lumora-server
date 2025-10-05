import { OrderModel } from "../order.modelold";
import { OrderStatus } from "../order.constants";
import { TOrderDoc } from "../order.type";

/**
 * Checks if an order is cancellable based on its current status.
 * @param orderId - The unique order ID
 * @returns A status flag, optional reason, and the order document
 */
export const isOrderCancellable = async (
  orderId: string
): Promise<{
  status: boolean;
  reason?: string;
  order?: TOrderDoc;
}> => {
  const order = await OrderModel.findOne({ orderId });

  if (!order) {
    return { status: false, reason: "Order not found" };
  }

  if (
    +order?.status === OrderStatus.Cancelled ||
    +order?.status === OrderStatus.Abandoned
  ) {
    return { status: false, reason: "Order is already cancelled" };
  }

  if (order.status >= OrderStatus.Shipped) {
    return { status: false, reason: "Order has already been processed", order };
  }

  return { status: true, order };
};
