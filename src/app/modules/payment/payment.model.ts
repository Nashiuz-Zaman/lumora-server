import { Schema, model } from "mongoose";
import { IPayment } from "./payment.type";
import { PaymentType } from "./payment.constant";

const paymentSchema = new Schema<IPayment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      trim: true,
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
    type: {
      type: String,
      enum: Object.values(PaymentType),
      required: true,
      index: true,
    },
    transactionId: {
      type: String,
      unique: true,
      required: false,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    details: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentModel = model<IPayment>("Payment", paymentSchema);
