import { sendEmail } from "@utils/sendEmail";
import { IOrder } from "@app/modules/order/order.type";

import { getOrderPlacedEmailHtml } from "../generator-helpers/getOrderPlacedEmailHtml";

export const sendOrderPlacedEmail = async (
  order: IOrder,
  attachment?: {
    filename: string;
    content: Buffer;
    contentType: string;
  }
) => {
  const html = getOrderPlacedEmailHtml(order, new Date().getFullYear());

  const result = await sendEmail(
    order.email,
    `Order Placed – ${order.orderId}`,
    html,
    undefined,
    attachment ? [attachment] : undefined
  );

  return result ? true : false;
};
