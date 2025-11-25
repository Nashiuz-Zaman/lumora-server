import { v4 as uuidv4 } from "uuid";
import { PaymentModel } from "../payment.model";
import { refundViaSslCommerz } from ".";
import { sendPaymentRefundedEmail } from "@app/modules/email/service";
import {
  throwBadRequest,
  throwNotFound,
  throwInternalServerError,
} from "@utils/index";
import { ClientSession, Types } from "mongoose";
import { createRefund } from "./createRefund";

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
    bankTranId: payment.details?.bank_tran_id,
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

  const refund = await createRefund({
    email: payment.email,
    name: payment.name,
    orderId: payment.orderId,
    orderObjId: payment.order,
    transactionId: refundResult.refund_ref_id as string,
    details: {
      ...refundResult,
      refundReason: reason,
      refundAmount,
    },
  });

  if (refund._id) {
    sendPaymentRefundedEmail(refund).catch((err) =>
      console.log("Failed to send refund email:", err)
    );
    return refund;
  }
};
