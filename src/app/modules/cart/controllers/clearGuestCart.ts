import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { RequestHandler } from "express";
import { clearCart } from "../services";

export const clearGuestCartController: RequestHandler = catchAsync(
  async (req, res) => {
    const cartId = req.params.id;
    const result = await clearCart(cartId);

    if (result) return sendSuccess(res, { message: "Cleared cart" });

    return throwInternalServerError();
  }
);
