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
  billingAddress: ICustomerAddress;
  shippingAddress: ICustomerAddress;
}

export interface ICustomerProfile {
  name: IUser["name"];
  email: IUser["email"];
  phone: NonNullable<IUser["phone"]>;
  image?: IUser["image"];
  lastLoginAt?: IUser["lastLoginAt"];
  createdAt?: IUser["createdAt"];
  billingAddress: ICustomer["billingAddress"];
  shippingAddress: ICustomer["shippingAddress"];
}

export type TCustomerDoc = HydratedDocument<ICustomer>;

declare module "../user/user.type" {
  interface IUserPopulated {
    customerProfile?: ICustomer;
  }
}
