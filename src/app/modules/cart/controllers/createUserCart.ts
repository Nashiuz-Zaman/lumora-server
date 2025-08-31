import { RequestHandler } from "express";
import { createCart } from "../services/createCart";
import { ISecureRequest } from "@app/shared/types";
import { TDatabaseCart } from "../cart.type";
import {
  catchAsync,
  sendSuccess,
  toObjectId,
  throwInternalServerError,
} from "@utils/index";

export const createUserCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const userId = req.decoded?.userId;
    const data: TDatabaseCart = req.body;

    data.user = toObjectId(userId!);
    const cart = await createCart(data, "user");

    if (cart._id)
      return sendSuccess(res, {
        message: "Cart created successfully",
        data: cart,
      });

    throwInternalServerError();
  }
);
