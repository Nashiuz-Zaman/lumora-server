import { cartCookieName } from "@app/modules/cart/cart.constant";
import { config } from "@config/env";
import { Response, NextFunction } from "express";
import { catchAsync, cleanCookie, verifyToken } from "@utils/index";
import { ISecureRequest } from "@app/shared/types";

export const cartAuthMiddleware = catchAsync(
  async (req: ISecureRequest, res: Response, next: NextFunction) => {
    const cartToken = req.cookies?.[cartCookieName];

    // no cart cookie
    if (!cartToken) {
      return next();
    }

    const result = await verifyToken(cartToken, config.cartTokenSecret);

    // Invalid or forged cookie
    if (!result?.valid) {
      cleanCookie(res, cartCookieName);
      return next();
    }

    if ("decoded" in req) {
      req.decoded = {
        ...req.decoded,
        cartId: result?.decoded.cartId,
      };
    } else {
      req.decoded = result.decoded;
    }

    next();
  },
);
