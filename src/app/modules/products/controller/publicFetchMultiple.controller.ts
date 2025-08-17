// core
import { RequestHandler } from "express";

// utils
import { catchAsync, sendSuccess } from "../../../../utils";
import { getProducts } from "../service/getProducts";

export const publicFetchMultipleProducts: RequestHandler = catchAsync(
  async (req, res) => {
    const data = await getProducts(req.query);

    sendSuccess(res, {
      data: { products: data.products, queryMeta: data.queryMeta },
    });
  }
);
