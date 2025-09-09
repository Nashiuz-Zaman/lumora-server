import { sendEmail } from "@utils/index";
import { IOrder } from "@app/modules/order/order.type";

import { generateOrderPlacedEmailHTML } from "./generateOrderPlacedEmailHTML";

export const sendOrderPlacedEmail = async (
  order: IOrder & { invoiceUrl?: string },
  attachment?: {
    filename: string;
    content: Buffer;
    contentType: string;
  }
): Promise<void> => {
  const { invoiceUrl, ...rest } = order;

  const html = generateOrderPlacedEmailHTML(rest);

  await sendEmail(
    order.email,
    `Order Placed – ${order.orderId}`,
    html,
    undefined,
    attachment ? [attachment] : undefined
  );
};
