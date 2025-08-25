import { RequestHandler } from "express";
import { getRelatedProducts } from "../service/getRelatedProducts";
import {
  throwInternalServerError,
  sendSuccess,
  catchAsync,
} from "@utils/index";

export const getRelatedProductsController: RequestHandler = catchAsync(
  async (req, res) => {
    const tags = req.query.tags as string;

    const products = await getRelatedProducts(tags);

    if (Array.isArray(products))
      return sendSuccess(res, { data: { products } });

    return throwInternalServerError();
  }
);
