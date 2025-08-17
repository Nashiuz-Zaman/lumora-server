// Core
import { RequestHandler } from "express";

// Utilities
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

// Services
import { createProduct } from "../service/createProduct";

// Helpers
import { orderImages } from "../products.helper";

// Types
import { TRawProduct } from "../product.type";

/**
 * Controller to create a new product
 */
export const createProductController: RequestHandler = catchAsync(
  async (req, res) => {
    // Step 1: Parse and prepare product data
    const product = JSON.parse(req.body.payload) as TRawProduct;
    product.images = orderImages(req);

    // Step 2: Persist product
    const created = await createProduct(product);

    // Step 3: Send response
    if (created) return sendSuccess(res);

    return throwInternalServerError("Product was not created. Server Error");
  }
);
