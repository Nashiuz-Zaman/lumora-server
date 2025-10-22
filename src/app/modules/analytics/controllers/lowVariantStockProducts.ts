import { RequestHandler } from "express";
import { catchAsync, sendSuccess } from "@utils/index";
import { getLowVariantStockProducts } from "../services";

export const lowVariantStockProductsController: RequestHandler = catchAsync(
  async (_req, res) => {
    const tableData = await getLowVariantStockProducts();

    sendSuccess(res, {
      data: tableData,
      message: "Low variant stock products retrieved successfully",
    });
  }
);
