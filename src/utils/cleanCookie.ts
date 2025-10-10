import { Response } from "express";

interface ICleanCookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export const cleanCookie = (
  res: Response,
  cookieName: string,
  {
    httpOnly = true,
    secure = true,
    sameSite = "none",
  }: ICleanCookieOptions = {}
): void => {
  res.clearCookie(cookieName, {
    httpOnly,
    secure,
    sameSite,
    maxAge: 0,
  });
};
