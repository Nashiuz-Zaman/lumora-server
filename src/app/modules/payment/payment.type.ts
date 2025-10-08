import { HydratedDocument, Types } from "mongoose";
import { TPaymentStatus } from "./payment.constant";

export interface IPayment {
  _id?: Types.ObjectId;
  order: Types.ObjectId;
  orderId: string;
  name: string;
  email: string;
  status: TPaymentStatus;
  transactionId: string;
  amount: number;
  currency: "BDT";
  gateway: "sslcommerz";
  paymentDetails?: Record<string, any>;
  refundDetails?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TPaymentDoc = HydratedDocument<IPayment>;

export interface IRefundOptions {
  refundAmount: number;
  refundReason: string;
  bankTranId: string;
  refundTransId: string;
  refeId: string;
}
