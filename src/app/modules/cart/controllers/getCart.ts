import { RequestHandler } from "express";
import { catchAsync, cleanCookie, sendSuccess } from "@utils/index";
import { ISecureRequest } from "@app/shared/types";
import { cartCookieName } from "../cart.constant";
import { getCart } from "../services/getCart";

export const getCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const userId = req.decoded?.userId;
    const cartId = req.cookies?.cartId;

    const result = await getCart(userId, cartId);

    if (result.removeCartCookie === true) cleanCookie(res, cartCookieName);

    sendSuccess(res, { data: { cart: result.cart } });
  },
);
