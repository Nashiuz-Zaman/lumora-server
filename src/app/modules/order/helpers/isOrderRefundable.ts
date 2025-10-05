import { PaymentModel } from "@app/modules/payment/payment.model";
import { TOrderDoc } from "../order.type";
import { PaymentStatus } from "@app/modules/payment/payment.constant";
import { TPaymentDoc } from "@app/modules/payment/payment.type";

/**
 * Checks if a given order is refundable based on payment status.
 * @param order - The order document
 * @returns A status flag and optional reason
 */

export type TOrderRefundableResult =
  | {
      status: true;
      payment: TPaymentDoc;
    }
  | {
      status: false;
      reason: string;
      payment?: undefined;
    };

export const isOrderRefundable = async (
  order: TOrderDoc
): Promise<TOrderRefundableResult> => {
  const payment = await PaymentModel.findOne({ order: order._id });

  if (!payment) {
    return { status: false, reason: "No payment found for this order" };
  }

  if (payment.status === PaymentStatus.Refunded) {
    return { status: false, reason: "Payment was already refunded" };
  }

  if (payment.status !== PaymentStatus.Paid) {
    return { status: false, reason: "Payment was not successful" };
  }

  return { status: true, payment };
};
