// core
import { RequestHandler } from "express";

// utils
import { throwNotFound } from "@utils/operationalErrors";
import { toObjectId } from "@utils/objectIdUtils";
import { sendSuccess } from "@utils/sendSuccess";
import { catchAsync } from "@utils/catchAsync";
import { getProduct } from "../service/getProduct";

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
