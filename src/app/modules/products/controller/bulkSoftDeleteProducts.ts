// controllers/bulkDeleteProductsController.ts

import { catchAsync } from "@utils/catchAsync";
import { RequestHandler } from "express";
import { bulkSoftDeleteProducts } from "../service/bulkSoftDeleteProducts";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";

export const bulkSoftDeleteProductsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { ids } = req.body;

    const result = await bulkSoftDeleteProducts(ids);

    if (result)
      return sendSuccess(res, {
        message: `${result.modifiedCount} product(s) deleted successfully.`,
        data: result,
      });

    return throwInternalServerError("Could not delete products. Server Error");
  }
);
