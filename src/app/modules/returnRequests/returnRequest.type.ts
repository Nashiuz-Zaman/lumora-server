import { HydratedDocument, Types } from "mongoose";
import { TReturnReason, TReturnRequestStatus } from "./returnRequest.constants";

export interface IReturnRequest {
  _id?: Types.ObjectId;
  order: Types.ObjectId;
  payment: Types.ObjectId;
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
