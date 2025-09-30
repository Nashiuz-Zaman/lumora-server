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
  validatedData?: any; // optional
  rawIpnPayload: any;
}) => {
  const amount = parseFloat(
    validatedData?.amount || rawIpnPayload?.amount || "0"
  );

  const currency = validatedData?.currency || rawIpnPayload?.currency || "BDT"; // match schema enum

  const status = validatedData?.status
    ? validatedData?.status === "VALID"
      ? PaymentStatus.Paid
      : validatedData?.status === "FAILED"
      ? PaymentStatus.Failed
      : PaymentStatus.Cancelled
    : rawIpnPayload?.status
    ? rawIpnPayload?.status === "VALID"
      ? PaymentStatus.Paid
      : rawIpnPayload?.status === "FAILED"
      ? PaymentStatus.Failed
      : PaymentStatus.Cancelled
    : PaymentStatus.Failed;

  const payment = await PaymentModel.create({
    order: orderObjId,
    name,
    email,
    transactionId,
    amount,
    currency,
    status,
    paymentDetails: validatedData?.status ? validatedData : rawIpnPayload,
  });

  return payment;
};
