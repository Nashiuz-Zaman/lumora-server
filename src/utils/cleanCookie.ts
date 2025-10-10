import { Response } from "express";

interface ICleanCookieOptions {
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export const cleanCookie = (
  res: Response,
  cookieName: string,
  {
    path = "/",
    httpOnly = true,
    secure = true,
    sameSite = "none",
  }: ICleanCookieOptions = {}
): void => {
  res.clearCookie(cookieName, {
    path,
    httpOnly,
    secure,
    sameSite,
  });
};
