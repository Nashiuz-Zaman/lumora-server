// core
import { RequestHandler } from "express";

// utils
import {
  throwNotFound,
  toObjectId,
  sendSuccess,
  catchAsync,
} from "@utils/index";
import { getProduct } from "../service";

export const getProductForAdminController: RequestHandler = catchAsync(
  async (req, res) => {
    const _id = req.params.id;

    // Filters for Mongo query
    const filters = { _id: toObjectId(_id) };

    const product = await getProduct(filters);
    if (!product) return throwNotFound("Product not found");

    return sendSuccess(res, { data: product });
  }
);
