import { HydratedDocument, Types } from "mongoose";
import { TReturnReason, TReturnRequestStatus } from "./returnRequest.constants";

export interface IReturnRequest {
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
