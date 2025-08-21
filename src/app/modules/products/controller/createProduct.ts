// Core
import { RequestHandler } from "express";

// Utilities
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

// Services
import { createProduct } from "../service/createProduct";

export const createProductController: RequestHandler = catchAsync(
  async (req, res) => {

    const product = JSON.parse(req.body);
    const created = await createProduct(product);
    if (created) return sendSuccess(res);

    return throwInternalServerError();
  }
);
