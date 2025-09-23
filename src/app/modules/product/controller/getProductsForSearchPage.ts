// Core / Third-party
import { RequestHandler } from "express";

// Utilities
import {
  sendSuccess,
  catchAsync,
  throwInternalServerError,
} from "@utils/index";

import { getProductsForSearchPage } from "../service";

export const getProductsForSearchPageController: RequestHandler = catchAsync(
  async (req, res) => {
    // Fetch products with query params
    const data = await getProductsForSearchPage({ ...req.query });

    if (data)
      return sendSuccess(res, {
        data: {
          products: data.products,
          queryMeta: data.queryMeta,
          brands: data.brands,
        },
      });

    // If no data found, throw server error
    return throwInternalServerError();
  }
);
