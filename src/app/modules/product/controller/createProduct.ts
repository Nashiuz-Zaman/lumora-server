// Core
import { RequestHandler } from "express";

// Utilities
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";

// Services
import { createProduct } from "../service/createProduct";

export const createProductController: RequestHandler = catchAsync(
  async (req, res) => {

    const product = req.body
    const created = await createProduct(product);
    if (created) return sendSuccess(res,{message: 'Product Created Successfully'});

    return throwInternalServerError();
  }
);
