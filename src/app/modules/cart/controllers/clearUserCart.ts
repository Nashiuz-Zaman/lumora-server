import { ISecureRequest } from "@app/shared/types";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { RequestHandler } from "express";
import { clearCart } from "../services";

export const clearUserCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const cartId = req.params.id;
    const result = await clearCart(cartId);

    if (result) return sendSuccess(res, { message: "Cart Updated" });

    return throwInternalServerError();
  }
);
