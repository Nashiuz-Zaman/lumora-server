import { Request } from "express";
import { IJwtPayload } from "./jwtPayload";
import { TUserDoc } from "@app/modules/user/user.type";

export interface ISecureRequest extends Request {
  user?: IJwtPayload;
  cartId?: string;
  userDoc?: TUserDoc;
  userType?: "customer" | "admin" | "unknown";
}
