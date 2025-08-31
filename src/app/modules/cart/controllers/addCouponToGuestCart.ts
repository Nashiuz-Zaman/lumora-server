import { RequestHandler } from "express";
import { addCouponToCart } from "../services";
import { catchAsync, sendSuccess } from "@utils/index";
import { ISecureRequest } from "@app/shared/types";

export const addCouponToGuestCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { couponCode } = req.body;
    const cartId = req.decoded?.cartId;

    const updatedCart = await addCouponToCart({ cartId, code: couponCode });

    sendSuccess(res, {
      message: "Coupon applied successfully to guest cart",
      data: updatedCart,
    });
  }
);
