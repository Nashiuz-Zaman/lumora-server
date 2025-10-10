import { Response } from "express";

interface ICookieOptions {
  cookieName: string;
  cookieContent: string | Record<string, any>;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export const setCookie = (
  res: Response,
  {
    cookieName,
    cookieContent,
    maxAge = 10 * 60 * 1000, // default 10 mins
    httpOnly = true,
    secure = true,
    sameSite = "none",
  }: ICookieOptions
) => {
  res.cookie(cookieName, cookieContent, {
    maxAge,
    httpOnly,
    secure,
    sameSite,
  });
};
