import { HydratedDocument, Types } from "mongoose";
import { TReturnReason, TReturnRequestStatus } from "./returnRequest.constants";
import { IOrder } from "../order/order.type";
import { IPayment } from "../payment/payment.type";

export interface IReturnRequest<O = string, P = string> {
  _id?: Types.ObjectId;
  order: O;
  payment: P;
  orderId: string;
  reason: TReturnReason;
  description: string;
  invoice: string;
  files?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  status: TReturnRequestStatus;
}

export type TReturnRequestDoc = HydratedDocument<IReturnRequest>;

export type TPopulatedReturnRequest = IReturnRequest<IOrder, IPayment>;
