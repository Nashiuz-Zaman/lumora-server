import { Response } from "express";
import { config } from "@config/env";
import { cartCookieName } from "@app/modules/cart/cart.constant";
import { setCookie, generateToken } from "@utils/index";

export const setCartCookie = (res: Response, cartId: string) => {
  const cartToken = generateToken({ cartId }, config?.cartTokenSecret, "30d");

  setCookie(res, {
    cookieName: cartCookieName,
    cookieContent: cartToken,
    // 30 days (1 month)
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
