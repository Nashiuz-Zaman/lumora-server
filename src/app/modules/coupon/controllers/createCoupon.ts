// Core
import { RequestHandler } from "express";

// Utils
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";

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
