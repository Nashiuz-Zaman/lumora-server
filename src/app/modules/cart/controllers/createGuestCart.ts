import { RequestHandler } from "express";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

import { TDatabaseCart } from "../cart.type";
import { setCartCookie, createCart } from "../services";

export const createGuestCartController: RequestHandler = catchAsync(
  async (req, res) => {
    const data: TDatabaseCart = req.body;

    const cart = await createCart(data, "guest");

    if (cart._id) {
      setCartCookie(res, cart._id.toString());
      return sendSuccess(res, { message: "Cart created successfully" });
    }

    throwInternalServerError();
  }
);
