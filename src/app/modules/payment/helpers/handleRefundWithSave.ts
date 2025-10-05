import httpStatus from "http-status";
import { AppError } from "@app/classes/AppError";

import { sendPaymentRefundedEmail } from "../../email/service/sendPaymentRefundedEmailToCustomer";
import { TPaymentDoc } from "../payment.type";
import { PaymentStatus } from "../payment.constant";
import { refundPayment } from "../service";

export const handleRefundWithSave = async (
  payment: TPaymentDoc,
  refundTransId: string,
  reason: string = "Order Cancelled",
  customAmount?: number
) => {
  const refundAmount = customAmount ?? payment.amount;

  console.log(refundAmount);

  const refundResult = await refundPayment({
    refundAmount,
    refundReason: reason,
    refundTransId,
    bankTranId: payment.paymentDetails?.bank_tran_id,
    refeId: payment.order.toString(),
  });

  if (
    refundResult.APIConnect !== "DONE" ||
    (refundResult.status !== "success" && refundResult.status !== "processing")
  ) {
    throw new AppError(
      `Refund failed: ${refundResult.errorReason || refundResult.status}`,
      httpStatus.BAD_REQUEST
    );
  }

  payment.refundDetails = {
    ...refundResult,
    refundReason: reason,
    refundAmount,
  };

  payment.status =
    refundAmount < payment.amount
      ? PaymentStatus["Partially Refunded"]
      : PaymentStatus.Refunded;

  const updatedPayment = await payment.save();

  if (updatedPayment._id) {
    sendPaymentRefundedEmail(payment);
    return updatedPayment;
  }
};
