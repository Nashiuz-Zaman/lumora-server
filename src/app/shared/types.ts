import { IJwtPayload } from "@utils/generateToken";
import { Request } from "express";

export interface ISecureRequest extends Request {
  decoded?: IJwtPayload;
}

// ---------------------------------------------------------
// STRING KEY OF
// Extracts only string keys from a type
// ---------------------------------------------------------
export type TStringKeyOf<T> = Extract<keyof T, string>;
