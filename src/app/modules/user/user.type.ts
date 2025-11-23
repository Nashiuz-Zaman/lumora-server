import { Types, HydratedDocument, Model } from "mongoose";
import { TUserStatus } from "./user.constants";
import { IRole } from "../role/type/role.type";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  id: string;
  email: string;
  password?: string | null;
  phone?: string;
  image?: string;

  isVerified: boolean;
  emailVerificationToken?: string;
  emailVerifiedAt?: Date;
  status: TUserStatus;

  role: Types.ObjectId | IRole;

  lastLoginAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserPopulated extends IUser {
  role: IRole;
}

export type TUserDoc = HydratedDocument<IUser>;
export type TUserPopulatedDoc = HydratedDocument<IUserPopulated>;

export interface IUserModel extends Model<IUser> {
  auth(email: string, password: string): Promise<Omit<IUser, "password">>;
}
