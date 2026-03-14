// Core
import { RequestHandler } from "express";

// Utilities
import { sendSuccess } from "@utils/sendSuccess";
import { catchAsync } from "@utils/catchAsync";
import { throwInternalServerError } from "@utils/operationalErrors";

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
