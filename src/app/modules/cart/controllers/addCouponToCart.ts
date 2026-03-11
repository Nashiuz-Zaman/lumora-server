import { RequestHandler } from "express";
import { addCouponToCart } from "../services/addCouponToCart";
import { catchAsync } from "@utils/catchAsync";
import { ISecureRequest } from "@app/shared/types";
import { sendSuccess } from "@utils/sendSuccess";

export const addCouponToCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { couponCode } = req.body;
    const { cartId } = req.decoded || {};

    const updatedCart = await addCouponToCart(cartId!, couponCode);

    sendSuccess(res, {
      message: "Coupon applied successfully",
      data: updatedCart,
    });
  },
);
