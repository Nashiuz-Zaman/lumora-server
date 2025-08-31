import { RequestHandler } from "express";
import { addCouponToCart } from "../services";
import { catchAsync, sendSuccess } from "@utils/index";
import { ISecureRequest } from "@app/shared/types";

export const addCouponToUserCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { couponCode } = req.body;
    const userId = req.decoded?.userId

    const updatedCart = await addCouponToCart({ userId, code: couponCode });

    sendSuccess(res, {
      message: "Coupon applied successfully to user cart",
      data: updatedCart,
    });
  }
);
