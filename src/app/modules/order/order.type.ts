import { TPopulatedCartItem } from "@app/modules/cart/cart.type";
import { Types, HydratedDocument } from "mongoose";
import { TOrderStatusValue } from "./order.constants";
import { ICustomer } from "../customer/customer.type";
import { IUser } from "../user/user.type";

export interface IOrderActivity {
  time: Date;
  status?: TOrderStatusValue;
  isArchived?: boolean;
}

export interface IOrder {
  _id?: Types.ObjectId;
  orderId?: string;
  cartId?: string;
  user?: Types.ObjectId | "guest"; // optional for guests
  name: IUser["name"];
  email: IUser["email"];
  phone: NonNullable<IUser["phone"]>;
  shippingAddress: ICustomer["shippingAddress"];
  billingAddress: ICustomer["billingAddress"];
  subtotal: number;
  total: number;
  shippingFee?: number;
  discount?: number;
  tax?: number;
  isArchived: boolean;
  items: TPopulatedCartItem[];
  couponCode?: string;
  status: TOrderStatusValue;
  activities: IOrderActivity[];
  shippingTrackingNumber?: string;
  shippingCarrier?: string;
  estimatedDelivery?: Date;
  cancellationReason?: string;
  returnReason?: string;
  invoice?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TOrderDoc = HydratedDocument<IOrder>;
