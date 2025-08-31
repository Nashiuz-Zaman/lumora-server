import { RequestHandler } from "express";
import { sendSuccess, catchAsync } from "@utils/index";
import { removeCouponFromCart } from "../services";
import { ISecureRequest } from "@app/shared/types";

export const removeCouponFromUserCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const userId = req.decoded?.userId;

    const updatedCart = await removeCouponFromCart({ userId });

    sendSuccess(res, {
      message: "Coupon removed successfully from user cart",
      data: updatedCart,
    });
  }
);
