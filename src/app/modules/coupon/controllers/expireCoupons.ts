import { RequestHandler } from "express";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { expireCoupons } from "../service/expireCoupons";

export const expireCouponsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { expireIds = [] } = req.body;

    const message = await expireCoupons(expireIds);

    if (message) return sendSuccess(res, { message });

    return throwInternalServerError();
  }
);
