import { Schema, model, Types } from "mongoose";
import { IOrder } from "./order.type";
import { OrderStatus, TOrderStatusValue } from "./order.constants";
import { getNextSequence } from "../counter/counter.util";
import { AppError } from "@app/classes";
import { decrementCouponUsageByCode } from "../coupon/service";
import { isObjectId } from "@utils/index";

// Activity sub-schema
const OrderActivitySchema = new Schema(
  {
    time: { type: Date, required: true, default: () => new Date() },
    status: {
      type: Number,
      enum: Object.values(OrderStatus),
      required: false,
    },
    isArchived: { type: Boolean, required: false },
  },
  { _id: false }
);

// Simplified variant for order
const OrderVariantSchema = new Schema(
  {
    _id: { type: Types.ObjectId, required: true },
    sku: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    discountPercentage: { type: Number },
  },
  {
    _id: false,
    strict: false, // allow any extra unknown fields like color, size, etc.
  }
);

// Simplified product for order
const OrderProductSchema = new Schema(
  {
    _id: { type: Types.ObjectId, required: true },
    title: { type: String, required: true },
    slug: { type: String },
    defaultPrice: { type: Number },
    defaultImage: { type: String },
    brand: { type: String },
  },
  { _id: false }
);

// Order item schema
const OrderItemSchema = new Schema(
  {
    product: { type: OrderProductSchema, required: true },
    variant: { type: OrderVariantSchema, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
); 

// Main order schema
const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, unique: true },
    user: {
      type: Schema.Types.Mixed,
      required: true,
      validate: {
        validator: (val: any) => val === "guest" || isObjectId(val),
        message: "User must be a valid ObjectId or 'guest'",
      },
    },
    cartId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    shippingAddress: { type: String, required: true },
    billingAddress: { type: String, required: true },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    shippingFee: { type: Number },
    discount: { type: Number },
    tax: { type: Number },
    items: { type: [OrderItemSchema], required: true },
    couponCode: { type: String },
    isArchived: { type: Boolean, default: false },
    status: {
      type: Number,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Pending,
    },
    activities: {
      type: [OrderActivitySchema],
      default: [
        {
          time: new Date(),
          status: OrderStatus.Pending,
        },
      ],
    },
    shippingTrackingNumber: { type: String },
    shippingCarrier: { type: String },
    estimatedDelivery: { type: Date },
    cancellationReason: { type: String },
    returnReason: { type: String },
    invoice: { type: String },
  },
  { timestamps: true }
);

OrderSchema.pre("save", async function (next) {
  try {
    const order = this;

    // Generate orderId if missing
    if (!order.orderId) {
      const seq = await getNextSequence("order");
      const paddedSeq = seq.toString().padStart(6, "0");
      order.orderId = `ORD${paddedSeq}`;
    }

    // If order is being cancelled, returned, or deleted → decrement coupon usage
    const cancelLikeStatuses: TOrderStatusValue[] = [
      OrderStatus.Cancelled,
      OrderStatus.Returned,
    ];

    // only run if status changed to one of those & order has a coupon
    if (
      order.isModified("status") &&
      cancelLikeStatuses.includes(order.status) &&
      order.couponCode
    ) {
      const session = this.$session?.() ?? undefined;
      await decrementCouponUsageByCode(order.couponCode, session);
    }

    next();
  } catch (err) {
    next(new AppError((err as Error).message));
  }
});

export const OrderModel = model<IOrder>("Order", OrderSchema);
