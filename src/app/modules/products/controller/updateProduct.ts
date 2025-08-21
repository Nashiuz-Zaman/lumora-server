// Core / Third-party
import { RequestHandler } from "express";

// Utilities
import {
  sendSuccess,
  catchAsync,
  throwInternalServerError,
} from "@utils/index";

// Services
import { updateProduct } from "../service/updateProduct";

/**
 * Controller to update an existing product
 */
export const updateProductController: RequestHandler = catchAsync(
  async (req, res) => {
    const _id = req.params.id;
    const product = JSON.parse(req.body);
    const success = await updateProduct({ _id }, product);

    if (!success) return throwInternalServerError();

    return sendSuccess(res, { message: "Product Updated" });
  }
);
