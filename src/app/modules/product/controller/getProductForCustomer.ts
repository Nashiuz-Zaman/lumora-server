// controllers/product.controller.ts

// Core / Third-party
import { RequestHandler } from "express";

// Utilities
import { catchAsync, sendSuccess, throwNotFound } from "@utils/index";

// Services
import { getProduct } from "../service/getProduct";

/**
 * Controller to fetch a product for customer by slug
 */
export const getProductForCustomerController: RequestHandler = catchAsync(
  async (req, res) => {
    const { slug } = req.params;

    // Build query
    const queryObj = { slug };

    // Fetch product
    const product = await getProduct(queryObj);

    // Handle not found
    if (!product) return throwNotFound("Product not found");

    // Send response
    return sendSuccess(res, { data: product });
  }
);
