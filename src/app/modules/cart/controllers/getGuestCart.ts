import { RequestHandler } from "express";
import { catchAsync, sendSuccess, toObjectId } from "@utils/index";
import { CartModel } from "../cart.model";
import { ISecureRequest } from "@app/shared/types";
import { emptyCart } from "../cart.constant";

export const getGuestCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const cartId = req.decoded?.cartId;

    if (!cartId) return sendSuccess(res, { data: emptyCart });

    const cart = await CartModel.getPopulatedCart(toObjectId(cartId));

    return sendSuccess(res, {
      data: { cart: cart?._id ? cart : emptyCart },
    });
  }
);
