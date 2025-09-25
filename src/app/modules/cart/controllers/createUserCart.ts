import { RequestHandler } from "express";
import { createCart } from "../services/createCart";
import { ISecureRequest } from "@app/shared/types";
import { ICartAction } from "../cart.type";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

export const createUserCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const userId = req.decoded?.userId;
    const actionData: ICartAction = req.body;

    const cart = await createCart(actionData, "user", userId);

    if (cart._id)
      return sendSuccess(res, {
        message: "Cart Updated",
        data: cart,
      });

    return throwInternalServerError();
  }
);
