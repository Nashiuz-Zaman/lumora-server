import { Response } from "express";
import { config } from "@config/env";
import {
  cleanCookie,
  generateToken,
  IJwtPayload,
  setCookie,
} from "@utils/index";

export const accessTokenName = "accessToken";
export const refreshTokenName = "refreshToken";

export const setAuthCookies = (res: Response, payload: IJwtPayload) => {
  // Generate access and refresh tokens
  const accessToken = generateToken(payload, config.accessTokenSecret, "15m");
  const refreshToken = generateToken(payload, config.refreshTokenSecret, "3d");

  // Set access token cookie (15 mins)
  setCookie(res, {
    cookieName: accessTokenName,
    cookieContent: accessToken,
    maxAge: 15 * 60 * 1000,
  });

  // Set refresh token cookie (3 days)
  setCookie(res, {
    cookieName: refreshTokenName,
    cookieContent: refreshToken,
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });
};

export const cleanAuthCookies = (res: Response) => {
  cleanCookie(res, accessTokenName);
  cleanCookie(res, refreshTokenName);
  return
};
