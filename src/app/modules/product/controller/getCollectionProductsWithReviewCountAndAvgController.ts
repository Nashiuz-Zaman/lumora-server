import { RequestHandler } from "express";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { getCollectionProductsWithReviewCountAndAvg } from "../service/getCollectionProductsWithReviewCountAndAvg";

export const getCollectionProductsWithReviewCountAndAvgController: RequestHandler =
  catchAsync(async (req, res) => {
    const queryobj = req.query;
    const { slug } = req.params;
    queryobj.slug = slug;

    const data = await getCollectionProductsWithReviewCountAndAvg(queryobj);

    if (data)
      return sendSuccess(res, {
        data: { products: data.products, queryMeta: data.queryMeta },
      });

    return throwInternalServerError();
  });
