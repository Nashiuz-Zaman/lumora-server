import { v4 as uuidv4 } from "uuid";
import { PaymentModel } from "../payment.model";
import { PaymentStatus } from "../payment.constant";
import { refundViaSslCommerz } from ".";
import { sendPaymentRefundedEmail } from "../../email/service/sendPaymentRefundedEmailToCustomer";
import {
  throwBadRequest,
  throwNotFound,
  throwInternalServerError,
} from "@utils/index";
import { ClientSession, Types } from "mongoose";

export const issueRefund = async (
  _id: Types.ObjectId,
  reason: string = "Order Cancelled",
  customAmount?: number,
  session: ClientSession | null = null
) => {
  if (!_id) return throwBadRequest("Payment _id not found");

  const payment = await PaymentModel.findById(_id).session(session);
  if (!payment) return throwNotFound("Payment not found");

  const refundAmount =
    typeof customAmount === "number" && customAmount > 0
      ? customAmount
      : payment.amount;

  const refundResult = await refundViaSslCommerz({
    refundAmount,
    refundReason: reason,
    refundTransId: uuidv4(),
    bankTranId: payment.paymentDetails?.bank_tran_id,
    refeId: payment.order.toString(),
  });

  if (
    refundResult.APIConnect !== "DONE" ||
    (refundResult.status !== "success" && refundResult.status !== "processing")
  ) {
    return throwInternalServerError(
      `Refund failed: ${refundResult.errorReason || refundResult.status}`
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

  const updatedPayment = await payment.save({ session });

  if (updatedPayment?._id) {
    sendPaymentRefundedEmail(updatedPayment).catch((err) =>
      console.log("Failed to send refund email:", err)
    );
    return updatedPayment;
  }
};
