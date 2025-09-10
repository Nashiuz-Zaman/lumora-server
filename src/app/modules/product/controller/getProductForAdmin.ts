// core
import { RequestHandler } from "express";

// utils

import { getProduct } from "../service/getProduct";
import { throwNotFound } from "@utils/operationalErrors";
import { toObjectId } from "@utils/objectIdUtils";
import { sendSuccess } from "@utils/sendSuccess";
import { catchAsync } from "@utils/catchAsync";

export const getProductForAdminController: RequestHandler = catchAsync(
  async (req, res) => {
    const _id = req.params.id;

    const queryObj = { _id: toObjectId(_id) };
    const product = await getProduct(queryObj);
    if (!product) return throwNotFound("Product not found");

    return sendSuccess(res, { data: product });
  }
);
