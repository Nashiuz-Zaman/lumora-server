import jwt from "jsonwebtoken";

export interface IJwtPayload {
  cartId?: string;
  userId?: string; // user._id not user.id
  email?: string;
  role?: string;
}

type TTimeUnit = "ms" | "s" | "m" | "h" | "d" | "w" | "y";

export interface ISignOptions {
  expiresIn?: number | `${number}${TTimeUnit}`;
}

export const generateToken = (
  payload: IJwtPayload,
  secret: string,
  expiresIn: ISignOptions["expiresIn"]
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};
