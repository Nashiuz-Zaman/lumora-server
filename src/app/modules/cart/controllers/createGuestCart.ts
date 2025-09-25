import { RequestHandler } from "express";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

import { ICartAction } from "../cart.type";
import { setCartCookie, createCart } from "../services";

export const createGuestCartController: RequestHandler = catchAsync(
  async (req, res) => {
    const actionData: ICartAction = req.body;

    const cart = await createCart(actionData);

    if (cart._id) {
      setCartCookie(res, cart._id.toString());
      return sendSuccess(res, { message: "Cart Updated" });
    }

    throwInternalServerError();
  }
);
