import { HydratedDocument, Types } from "mongoose";
import { TPaymentType } from "./payment.constant";
import { IOrder } from "../order/order.type";
import { IUser } from "../user/user.type";

export interface IPayment {
  _id?: Types.ObjectId;
  order: Types.ObjectId;
  orderId: NonNullable<IOrder["orderId"]>;
  name: NonNullable<IUser["name"]>;
  email: IUser["email"];
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

export interface IPayPayload {
  order: IOrder;
  shippingAddress: NonNullable<IOrder["shippingAddress"]>;
  name: NonNullable<IUser["name"]>;
  email: NonNullable<IUser["email"]>;
  phone: NonNullable<IUser["phone"]>;
}
