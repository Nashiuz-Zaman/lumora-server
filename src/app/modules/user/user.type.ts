import { Types, HydratedDocument, Model } from "mongoose";
import { TUserStatus } from "./user.constants";

export interface IUser {
  _id: Types.ObjectId;
  displayName?: string;
  name?: string;
  id: string;
  email: string;
  password?: string | null;
  phone?: string;
  image?: string;

  isVerified: boolean;
  emailVerificationToken?: string;
  emailVerifiedAt?: Date;
  status: TUserStatus;

  role: Types.ObjectId;

  lastLoginAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export type TUserDoc = HydratedDocument<IUser>;



export interface IUserModel extends Model<IUser> {
  auth(email: string, password: string): Promise<Omit<IUser, "password">>;
  getUser(
    filter: Record<string, any>,
    options?: { select?: string }
  ): Promise<TUserDoc | null>;
}
