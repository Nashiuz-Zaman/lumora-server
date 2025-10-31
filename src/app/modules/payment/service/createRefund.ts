import { PaymentType } from "../payment.constant";
import { PaymentModel } from "../payment.model";
import { Types } from "mongoose";

export const createRefund = async ({
  orderObjId,
  orderId,
  name,
  email,
  transactionId,
  details,
}: {
  orderObjId: Types.ObjectId;
  orderId: string;
  name: string;
  email: string;
  transactionId: string;
  details: any;
}) => {
  const payment = await PaymentModel.create({
    order: orderObjId,
    orderId,
    name,
    email,
    transactionId,
    amount: parseFloat(details.refundAmount || "0"),
    type: PaymentType.refund,
    details,
  });

  return payment;
};
