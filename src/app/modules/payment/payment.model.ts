import { Schema, model } from "mongoose";
import { PaymentStatus } from "./payment.constant";
import { IPayment } from "./payment.type";

const paymentSchema = new Schema<IPayment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: Number,
      enum: Object.values(PaymentStatus),
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ["BDT"],
      default: "BDT",
    },
    gateway: {
      type: String,
      enum: ["sslcommerz"],
      default: "sslcommerz",
    },
    paymentDetails: {
      type: Schema.Types.Mixed,
      default: null,
    },
    refundDetails: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentModel = model<IPayment>("Payment", paymentSchema);
