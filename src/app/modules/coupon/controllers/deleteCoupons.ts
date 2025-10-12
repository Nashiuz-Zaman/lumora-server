import { RequestHandler } from "express";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { deleteCoupons } from "../service/deleteCoupons";

export const deleteCouponsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { _ids = [] } = req.body;

    const message = await deleteCoupons(_ids);

    if (message) return sendSuccess(res, { message });

    return throwInternalServerError();
  }
);
