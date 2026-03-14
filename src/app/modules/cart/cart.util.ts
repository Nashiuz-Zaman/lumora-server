import { Response } from "express";
import { config } from "@config/env";
import { cartCookieName } from "@app/modules/cart/cart.constant";
import { setCookie } from "@utils/setCookie";
import { generateToken } from "@utils/generateToken";

export const setCartCookie = (res: Response, cartId: string) => {
  // Remove old cookie if exists
  res.clearCookie(cartCookieName);

  // Generate new token
  const cartToken = generateToken({ cartId }, config.cartTokenSecret, "30d");

  setCookie(res, {
    cookieName: cartCookieName,
    cookieContent: cartToken,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
