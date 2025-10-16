import { RequestHandler } from "express";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { expireCoupons } from "../service/expireCoupons";

export const expireCouponsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { ids: _ids = [] } = req.body;

    const message = await expireCoupons(_ids);

    if (message) return sendSuccess(res, { message });

    return throwInternalServerError();
  }
);
