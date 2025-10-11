import { RequestHandler } from "express";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
  toObjectId,
} from "@utils/index";
import { updateCartItems } from "../services";
import { ISecureRequest } from "@app/shared/types";

export const updateUserCartItemsController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const actionData = req.body;
    const userId = req?.decoded?.userId;

    const result = await updateCartItems(
      { user: toObjectId(userId!) },
      actionData
    );

    if (result) return sendSuccess(res, { message: "Cart Updated" });

    return throwInternalServerError();
  }
);
