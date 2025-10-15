import { Schema, model } from "mongoose";
import { ReturnRequestStatus } from "./returnRequest.constants";
import { IReturnRequest } from "./returnRequest.type";
import { OrderModel } from "../order/order.model";
import { AppError } from "@app/classes";
import { PaymentModel } from "../payment/payment.model";

const returnRequestSchema = new Schema<IReturnRequest>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
    orderId: { type: String, required: true },
    reason: { type: String, required: true },
    description: { type: String, required: true },
    invoice: { type: String, required: true },
    files: { type: [String], default: [] },
    status: {
      type: Number,
      enum: Object.values(ReturnRequestStatus),
      default: ReturnRequestStatus.Pending,
    },
  },
  { timestamps: true }
);

// Pre-save hook: fetch order _id using orderId
returnRequestSchema.pre("save", async function (next) {
  if (!this.isModified("orderId")) return next();

  try {
    // Find and set Order _id
    const order = await OrderModel.exists({ orderId: this.orderId });

    if (!order) {
      throw new Error(`Order with orderId ${this.orderId} not found`);
    }
    this.order = order._id;

    // Find and set Payment _id
    const payment = await PaymentModel.exists({ orderId: this.orderId });

    if (!payment) {
      throw new Error(`Payment for the order in the return request not found`);
    }
    this.payment = payment._id;

    next();
  } catch (err) {
    next(new AppError((err as Error)?.message));
  }
});

export const ReturnRequestModel = model<IReturnRequest>(
  "ReturnRequest",
  returnRequestSchema
);
