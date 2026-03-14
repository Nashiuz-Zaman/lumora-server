// controllers/category.controller.ts

import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";
import { RequestHandler } from "express";
import { getCategoryTree } from "../service/getCategoryTree";

export const getCategoryTreeController: RequestHandler = catchAsync(
  async (_req, res) => {
    const categoryTree = await getCategoryTree();

    if (!categoryTree)
      return throwInternalServerError("Categories query server error");

    return sendSuccess(res, { data: { categoryTree } });
  }
);
