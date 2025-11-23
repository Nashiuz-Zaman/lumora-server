import { Types, HydratedDocument } from "mongoose";

export interface IAdmin {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
}

export type TAdminDoc = HydratedDocument<IAdmin>;

declare module "../user/user.type" {
  interface IUserPopulated {
    adminProfile?: IAdmin;
  }
}
