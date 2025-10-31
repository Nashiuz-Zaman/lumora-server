import { sendEmail } from "@utils/sendEmail";
import { formatPrice } from "@utils/formatPrice";
import { IPayment } from "../../payment/payment.type";
import { OrderModel } from "@app/modules/order/order.model";
import { getRefundProcessedEmailHtml } from "../generator-helpers";
import { throwNotFound } from "@utils/operationalErrors";

export const sendPaymentRefundedEmail = async (
  financialTransaction: IPayment
): Promise<void> => {
  const order = await OrderModel.findById(
    financialTransaction.order,
    "orderId"
  ).exec();

  if (!order) return throwNotFound("Order not found");

  const html = getRefundProcessedEmailHtml(
    financialTransaction?.name,
    order.orderId!,
    formatPrice(financialTransaction?.amount),
    financialTransaction?.details?.refundReason || "Refund processed by admin",
    new Date().getFullYear()
  );

  await sendEmail(
    financialTransaction.email,
    `Refund Processed – Order #${order?.orderId}`,
    html
  );
};
