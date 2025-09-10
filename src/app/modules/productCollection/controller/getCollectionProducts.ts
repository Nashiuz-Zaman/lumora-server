import { RequestHandler } from "express";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { getCollectionProducts } from "../service/getCollectionProducts";

export const getCollectionProductsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { slug } = req.params;

    const { queryMeta, products } = await getCollectionProducts(
      slug,
      req.query
    );

    if (products) return sendSuccess(res, { data: { queryMeta, products } });

    return throwInternalServerError();
  }
);
