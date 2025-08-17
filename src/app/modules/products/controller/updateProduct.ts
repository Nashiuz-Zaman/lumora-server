// controllers/product.controller.ts

// Core / Third-party
import { RequestHandler } from "express";

// Utilities
import {
  sendSuccess,
  catchAsync,
  throwInternalServerError,
} from "@utils/index";
import { orderImages } from "../products.helper";

// Types
import { TRawProduct } from "../product.type";

// Services
import { updateProduct } from "../service/updateProduct";

/**
 * Controller to update an existing product
 */
export const updateProductController: RequestHandler = catchAsync(
  async (req, res) => {
    const _id = req.params.id;

    // Parse payload and process images
    const product = JSON.parse(req.body.payload) as TRawProduct;
    product.images = orderImages(req);

    // Update product in DB
    const updatedProduct = await updateProduct({ _id }, product);

    if (updatedProduct?._id) return sendSuccess(res);

    // If not updated, throw server error
    return throwInternalServerError();
  }
);
