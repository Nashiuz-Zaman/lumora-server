import { PaymentModel } from "../payment.model";
import { PaymentStatus } from "../payment.constant";
import { TOrderStatusValue } from "../../order/order.constants";
import { Types } from "mongoose";

export const checkDuplicatePayment = async (
  orderObjId: Types.ObjectId,
  currentOrderStatus: TOrderStatusValue
): Promise<{
  status: "already_processed";
  paymentId: string;
  orderStatus: TOrderStatusValue;
} | null> => {
  const existingPayment = await PaymentModel.findOne({
    order: orderObjId,
    status: PaymentStatus.Paid,
  });

  if (existingPayment) {
    return {
      status: "already_processed",
      paymentId: existingPayment._id.toString(),
      orderStatus: currentOrderStatus,
    };
  }

  return null;
};
