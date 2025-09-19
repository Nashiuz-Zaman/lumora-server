// Core / Third-party
import { RequestHandler } from "express";

// Utilities
import {
  sendSuccess,
  catchAsync,
  throwInternalServerError,
  decompressBase64UrlToObject,
} from "@utils/index";

// Services
import { getProducts } from "../service/getProducts";

export const getProductsForSearchPageController: RequestHandler = catchAsync(
  async (req, res) => {
    const { q, ...rest } = req.query;

    let decompressedParams = {};
    if (q) {
      const result = await decompressBase64UrlToObject(req.query.q as string);
      decompressedParams = result ?? {};
    }

    const limitFields =
      "defaultOldPrice,defaultImage,defaultPrice,title,slug,brand";
    const queryObj = { ...rest, ...decompressedParams, limitFields, limit: 16 };

    // Fetch products with query params
    const data = await getProducts(queryObj);

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
