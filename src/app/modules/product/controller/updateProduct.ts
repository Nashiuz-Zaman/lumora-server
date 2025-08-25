// Core / Third-party
import { RequestHandler } from "express";

// Utilities
import {
  sendSuccess,
  catchAsync,
  throwInternalServerError,
  toObjectId,
} from "@utils/index";

// Services
import { updateProduct } from "../service/updateProduct";

/**
 * Controller to update an existing product
 */
export const updateProductController: RequestHandler = catchAsync(
  async (req, res) => {
    const _id = req.params.id;
    console.log(_id);
    const product = req.body;
    console.log(product);
    const success = await updateProduct({ _id: toObjectId(_id) }, product);

    if (!success) return throwInternalServerError();

    return sendSuccess(res, { message: "Product Updated" });
  }
);
