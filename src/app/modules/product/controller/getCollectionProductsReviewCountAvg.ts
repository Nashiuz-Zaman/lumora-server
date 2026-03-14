import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";
import { getCollectionProductsReviewCountAvg } from "../service/getCollectionProductsReviewCountAvg";

export const getCollectionProductsReviewCountAvgController: RequestHandler =
  catchAsync(async (req, res) => {
    const queryobj = req.query;
    const { slug } = req.params;
    queryobj.slug = slug;

    const data = await getCollectionProductsReviewCountAvg(queryobj);

    if (data)
      return sendSuccess(res, {
        data: { products: data.products, queryMeta: data.queryMeta },
      });

    return throwInternalServerError();
  });
