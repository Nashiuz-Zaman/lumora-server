import { Request, Response } from "express";
import { getRelatedProducts } from "../service";
import {
  sendSuccess,
  catchAsync,
  throwInternalServerError,
} from "@utils/index";

export const getRelatedProductsController = catchAsync(
  async (req: Request, res: Response) => {
    const { productId, topCategoryId } = req.query;

    console.log(productId, topCategoryId);

    const products = await getRelatedProducts(
      productId as string,
      topCategoryId as string
    );

    console.log(products);

    if (Array.isArray(products))
      return sendSuccess(res, { data: { products } });

    return throwInternalServerError();
  }
);
