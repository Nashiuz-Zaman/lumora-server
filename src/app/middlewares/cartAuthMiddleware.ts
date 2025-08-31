import { cartCookieName } from "@app/modules/cart/cart.constant";
import { ISecureRequest } from "@app/shared/types";
import { config } from "@config/env";
import { Request, Response, NextFunction } from "express";
import { catchAsync, cleanCookie, verifyToken } from "@utils/index";

export const cartAuthMiddleware = () =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const cartToken = req.cookies?.[cartCookieName];

    // no cart cookie
    if (!cartToken) {
      return next();
    }

    const result = await verifyToken(cartToken, config.cartTokenSecret);

    // Invalid or forged cookie
    if (!result?.valid) {
      cleanCookie(res, "Cart_Token");
      return next();
    }

    (req as ISecureRequest).decoded = result.decoded;

    next();
  });
