// Core
import { RequestHandler } from "express";

// Utils
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

// Services
import { getCoupons } from "../service/getCoupons";

export const getCouponList: RequestHandler = catchAsync(async (req, res) => {
  const query = req.query;

  const coupons = await getCoupons(query);

  if (coupons)
    return sendSuccess(res, {
      data: coupons,
    });

  return throwInternalServerError();
});
