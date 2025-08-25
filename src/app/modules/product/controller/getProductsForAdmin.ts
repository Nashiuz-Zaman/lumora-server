// Core / Third-party
import { RequestHandler } from "express";

// Utilities
import {
  sendSuccess,
  catchAsync,
  throwInternalServerError,
} from "@utils/index";

// Services
import { getProducts } from "../service/getProducts";

/**
 * Controller to fetch products for admin with query-based filtering/pagination
 */
export const getProductsForAdminController: RequestHandler = catchAsync(
  async (req, res) => {
    // Fetch products with query params
    const data = await getProducts(req.query);

    if (data) {
      return sendSuccess(res, {
        data: { products: data.products, queryMeta: data.queryMeta },
      });
    }

    // If no data found, throw server error
    return throwInternalServerError();
  }
);
