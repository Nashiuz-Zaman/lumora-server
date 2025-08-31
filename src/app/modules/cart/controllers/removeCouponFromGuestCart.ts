import { RequestHandler } from "express";
import { sendSuccess, catchAsync } from "@utils/index";
import { removeCouponFromCart } from "../services";
import { ISecureRequest } from "@app/shared/types";

export const removeCouponFromGuestCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const cartId = req.decoded?.cartId;

    const updatedCart = await removeCouponFromCart({ cartId });

    sendSuccess(res, {
      message: "Coupon removed successfully from user cart",
      data: updatedCart,
    });
  }
);
