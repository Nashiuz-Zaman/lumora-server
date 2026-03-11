import { CartModel } from "../cart.model";
import { throwBadRequest, throwNotFound, toObjectId } from "@utils/index";

export const removeCouponFromCart = async (cartId: string) => {
  if (!cartId) return throwBadRequest("Cart id must be provided");

  const cart = await CartModel.findById(toObjectId(cartId));
  if (!cart) return throwNotFound("Cart not found");

  // Remove coupon
  cart.couponCode = "";

  // Save cart and pre-save hook will handle recalculation
  await cart.save();

  return cart;
};
