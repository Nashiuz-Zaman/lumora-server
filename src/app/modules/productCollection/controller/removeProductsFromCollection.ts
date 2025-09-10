import { RequestHandler } from "express";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { removeProductsFromCollection } from "../service";

export const removeProductsFromCollectionController: RequestHandler =
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { productIds } = req.body;

    const success = await removeProductsFromCollection(id, productIds);

    if (success)
      return sendSuccess(res, { message: "Removed from Collection" });

    return throwInternalServerError();
  });
