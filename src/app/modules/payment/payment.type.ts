import { HydratedDocument, Types } from "mongoose";
import { TPaymentType } from "./payment.constant";

export interface IPayment {
  _id?: Types.ObjectId;
  order: Types.ObjectId;
  orderId: string;
  name: string;
  email: string;
  type: TPaymentType;
  transactionId?: string;
  amount: number;
  details?: Record<string, any>;
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
