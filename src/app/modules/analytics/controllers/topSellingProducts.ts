import { RequestHandler } from "express";
import { catchAsync, sendSuccess } from "@utils/index";
import { getTopSellingProducts } from "../services";

export const topSellingProductsController: RequestHandler = catchAsync(
  async (req, res) => {
    const tableData = await getTopSellingProducts(req.query);

    sendSuccess(res, {
      data: tableData,
      message: "Top selling products retrieved successfully",
    });
  }
);
