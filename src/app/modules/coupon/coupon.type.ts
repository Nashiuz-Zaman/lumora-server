import { HydratedDocument, Types } from "mongoose";

export interface ICoupon {
  _id?: Types.ObjectId;
  code: string;
  description?: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  startDate: Date;
  expiryDate: Date;
  usageLimit?: number;
  usedCount?: number;
  minimumOrderAmount?: number;
  status: number
}

export type TCouponDoc = HydratedDocument<ICoupon>;
