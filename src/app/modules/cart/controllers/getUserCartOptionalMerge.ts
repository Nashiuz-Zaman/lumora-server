import { RequestHandler } from "express";
import { catchAsync, sendSuccess } from "@utils/index";
import { getUserCart, mergeCart } from "../services";
import { ISecureRequest } from "@app/shared/types";
import { emptyCart } from "../cart.constant";

export const getUserCartOptionalMergeController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { cartId, userId } = req.decoded!;

    // console.log(cartId, userId);

    // if cart ID from decoded cookie exists then it means there is a session cart for guest cart, we have to merge it
    if (cartId) {
      const newMergedCart = await mergeCart(res, userId!, cartId);

      return sendSuccess(res, {
        data: newMergedCart?._id ? newMergedCart : emptyCart,
      });
    }

    // if there is no cart ID then no session cart is present, so no need for merging, just get the user cart if available
    const cart = await getUserCart(userId!);

    return sendSuccess(res, {
      data: { cart: cart?._id ? cart : emptyCart },
    });
  }
);
