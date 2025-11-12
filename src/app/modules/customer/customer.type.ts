import { Types, HydratedDocument } from "mongoose";
import { IUser } from "../user/user.type";

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

export interface ICustomerProfile {
  name: IUser["name"];
  email: IUser["email"];
  phone: IUser["phone"];
  image?: IUser["image"];
  lastLoginAt?: IUser["lastLoginAt"];
  createdAt?: IUser["createdAt"];
  billingAddress?: ICustomerAddress;
  shippingAddress?: ICustomerAddress;
}

export type TCustomerDoc = HydratedDocument<ICustomer>;
