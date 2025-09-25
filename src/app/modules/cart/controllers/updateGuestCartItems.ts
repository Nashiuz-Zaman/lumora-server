import { RequestHandler } from "express";

import { updateCartItems } from "../services/updateCartItems";
import {
  catchAsync,
  throwInternalServerError,
  sendSuccess,
  toObjectId,
} from "@utils/index";
import { ISecureRequest } from "@app/shared/types";

export const updateGuestCartItemsController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const actionData = req.body;
    const cartId = req.decoded?.cartId;
  

    const result = await updateCartItems(
      { _id: toObjectId(cartId!) },
      actionData
    );

    if (result) return sendSuccess(res, { message: "Cart Updated" });

    return throwInternalServerError();
  }
);
