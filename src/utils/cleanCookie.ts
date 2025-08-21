import { Response } from "express";

interface ICleanCookieOptions {
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  domain?: string;
}

export const cleanCookie = (
  res: Response,
  cookieName: string,
  {
    path = "/",
    httpOnly = true,
    secure = true,
    sameSite = "none",
    domain,
  }: ICleanCookieOptions = {}
): void => {
  res.clearCookie(cookieName, {
    path,
    httpOnly,
    secure,
    sameSite,
    domain,
  });
};
