// Core / Third-party
import { RequestHandler } from "express";

// Utilities
import { sendSuccess } from "@utils/sendSuccess";
import { catchAsync } from "@utils/catchAsync";
import { throwInternalServerError } from "@utils/operationalErrors";

import { getProductsForSearchPage } from "../service/getProductsForSearchPage";

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
