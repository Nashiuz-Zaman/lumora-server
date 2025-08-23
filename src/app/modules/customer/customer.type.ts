import { Types, HydratedDocument } from "mongoose";

export interface ICustomerAddress {
  address?: string;
  country?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface ICustomer {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  billingAddress?: ICustomerAddress;
  shippingAddress?: ICustomerAddress;
}

export type TCustomerDoc = HydratedDocument<ICustomer>;
