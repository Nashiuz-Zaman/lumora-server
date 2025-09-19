// Core
import { RequestHandler } from "express";

// Utilities
import {
  sendSuccess,
  catchAsync,
  throwInternalServerError,
} from "@utils/index";

// Services
import { getProducts } from "../service/getProducts";

export const getProductsForAdminController: RequestHandler = catchAsync(
  async (req, res) => {
    const data = await getProducts(req.query);

    if (data) {
      return sendSuccess(res, {
        data: { products: data.products, queryMeta: data.queryMeta },
      });
    }

    return throwInternalServerError();
  }
);
