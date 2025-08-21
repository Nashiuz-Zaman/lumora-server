import { IJwtPayload } from "@utils/generateToken";
import { Request } from "express";

export interface ISecureRequest extends Request {
  decoded: IJwtPayload;
}
