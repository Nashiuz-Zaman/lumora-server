import { sendEmail } from "@utils/sendEmail";
import { formatPrice } from "@utils/formatPrice";
import { IPayment } from "../../payment/payment.type";
import { OrderModel } from "@app/modules/order/order.model";
import { getRefundProcessedEmailHtml } from "../generator-helpers";
import { throwNotFound } from "@utils/operationalErrors";

export const sendPaymentRefundedEmail = async (
  payment: IPayment
): Promise<void> => {
  const order = await OrderModel.findById(payment.order, "orderId").exec();

  if (!order) return throwNotFound("Order not found");

  const html = getRefundProcessedEmailHtml(
    payment?.name,
    order.orderId!,
    formatPrice(payment?.amount),
    payment?.refundDetails?.refundReason || "Refund processed by admin",
    new Date().getFullYear()
  );

  await sendEmail(
    payment.email,
    `Refund Processed – Order #${order?.orderId}`,
    html
  );
};
