// Core
import { RequestHandler } from "express";

// Utils
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

// Services
import { createCoupon } from "../service/createCoupon";

export const createCouponController: RequestHandler = catchAsync(
  async (req, res) => {
    const createdCoupon = await createCoupon(req.body);

    if (createdCoupon._id)
      return sendSuccess(res, {
        message: "Coupon created successfully",
      });

    return throwInternalServerError("Error creating coupon");
  }
);
