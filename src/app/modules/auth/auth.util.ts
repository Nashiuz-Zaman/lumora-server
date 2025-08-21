import { config } from "@config/env";
import {
  cleanCookie,
  generateToken,
  IJwtPayload,
  setCookie,
} from "@utils/index";
import { Response } from "express";

export const setAuthCookies = (res: Response, payload: IJwtPayload) => {
  // Generate access and refresh tokens
  const accessToken = generateToken(payload, config.accessTokenSecret, "15m");
  const refreshToken = generateToken(payload, config.refreshTokenSecret, "3d");

  // Set access token cookie (15 mins)
  setCookie(res, {
    cookieName: "Access_Token",
    cookieContent: accessToken,
    maxAge: 15 * 60 * 1000,
  });

  // Set refresh token cookie (3 days)
  setCookie(res, {
    cookieName: "Refresh_Token",
    cookieContent: refreshToken,
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });
};

export const cleanAuthCookies = (res: Response) => {
  cleanCookie(res, "Access_Token");
  cleanCookie(res, "Refresh_Token");
};
