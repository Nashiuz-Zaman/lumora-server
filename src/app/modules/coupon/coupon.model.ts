import { Schema, model } from "mongoose";
import { ICoupon } from "./coupon.type";
import { CouponStatus } from "./coupon.constant";

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    minimumOrderAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      enum: Object.values(CouponStatus),
      default: CouponStatus.Active,
    },
  },
  {
    timestamps: true,
  }
);

export const CouponModel =
  model<ICoupon>("Coupon", couponSchema) || model("Coupon");
