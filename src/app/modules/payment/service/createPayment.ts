import { PaymentModel } from "../payment.model";
import { PaymentStatus } from "../payment.constant";
import { Types } from "mongoose";

export const createPayment = async ({
  orderObjId,
  name,
  email,
  transactionId,
  validatedData,
  rawIpnPayload,
}: {
  orderObjId: Types.ObjectId;
  name: string;
  email: string;
  transactionId: string;
  validatedData?: any;
  rawIpnPayload: any;
}) => {
  const data = validatedData || rawIpnPayload;

  const payment = await PaymentModel.create({
    order: orderObjId,
    name,
    email,
    transactionId,
    amount: parseFloat(data.amount || "0"),
    currency: data.currency || "BDT",
    status: PaymentStatus.Paid,
    paymentDetails: data,
  });

  return payment;
};
