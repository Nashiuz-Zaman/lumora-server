import { TPopulatedCartItem } from "@app/modules/cart/cart.type";
import { Types, HydratedDocument } from "mongoose";
import { TOrderStatusValue } from "./order.constants";

export interface IOrderActivity {
  time: Date;
  status: TOrderStatusValue;
}

export interface IOrder {
  _id?: Types.ObjectId;
  orderId?: string;
  cartId?: string;
  user?: Types.ObjectId | "guest"; // optional for guests
  name: string;
  email: string;
  phone?: string;
  deliveryAddress: string;
  subtotal: number;
  total: number;
  shippingFee?: number;
  discount?: number;
  tax?: number;
  items: TPopulatedCartItem[];
  couponCode?: string;
  status: TOrderStatusValue;
  activities: IOrderActivity[];
  shippingTrackingNumber?: string;
  shippingCarrier?: string;
  estimatedDelivery?: Date;
  cancellationReason?: string;
  invoice?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TOrderDoc = HydratedDocument<IOrder>;
