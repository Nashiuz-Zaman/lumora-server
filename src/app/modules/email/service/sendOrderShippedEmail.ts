import { sendEmail } from "@utils/index";
import { IOrder } from "@app/modules/order/order.type";
import { getOrderShippedEmailHtml } from "../generator-helpers";

export const sendOrderShippedEmail = async (order: IOrder): Promise<void> => {
  const {
    orderId,
    name,
    shippingTrackingNumber,
    shippingCarrier,
    estimatedDelivery,
  } = order;
  const html = getOrderShippedEmailHtml(
    orderId!,
    name,
    shippingTrackingNumber!,
    shippingCarrier!,
    estimatedDelivery!,
    new Date().getFullYear()
  );

  await sendEmail(order.email, `Order Shipped – ${order.orderId}`, html);
};
