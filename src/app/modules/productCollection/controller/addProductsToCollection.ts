import { RequestHandler } from "express";

import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { addProductsToCollection } from "../service/addProductsToCollection";

export const addProductsToCollectionController: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const { productIds } = req.body;

    const success = await addProductsToCollection(id, productIds);

    if (success) return sendSuccess(res, { message: "Added to Collection" });

    return throwInternalServerError();
  }
);
