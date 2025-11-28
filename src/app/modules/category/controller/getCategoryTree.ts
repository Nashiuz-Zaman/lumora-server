// controllers/category.controller.ts

import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { RequestHandler } from "express";
import { getCategoryTree } from "../service";

export const getCategoryTreeController: RequestHandler = catchAsync(
  async (_req, res) => {
    const categoryTree = await getCategoryTree();

    if (!categoryTree)
      return throwInternalServerError("Categories query server error");

    return sendSuccess(res, { data: { categoryTree } });
  }
);
