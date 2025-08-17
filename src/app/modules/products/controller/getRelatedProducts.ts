import { RequestHandler } from "express";

import { catchAsync } from "@utils/catchAsync";
import { getRelatedProducts } from "../service/getRelatedProducts";
import { sendSuccess } from "@utils/sendSuccess";

export const getRelatedProductsController: RequestHandler = catchAsync(
  async (req, res) => {
    const tags = req.body.tags as string[] | string;

    console.log(typeof tags);

    const products = await getRelatedProducts(tags);

    sendSuccess(res, { data: { products } });
  }
);
