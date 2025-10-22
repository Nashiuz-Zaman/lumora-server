import { RequestHandler } from "express";
import { catchAsync, sendSuccess } from "@utils/index";
import { getLowTotalStockProducts } from "../services";

export const lowTotalStockProductsController: RequestHandler = catchAsync(
  async (_req, res) => {
    const tableData = await getLowTotalStockProducts();

    sendSuccess(res, {
      data: tableData,
      message: "Low stock products retrieved successfully",
    });
  }
);
