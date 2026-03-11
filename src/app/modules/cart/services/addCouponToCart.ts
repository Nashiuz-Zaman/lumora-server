import { CartModel } from "../cart.model";
import { throwBadRequest, throwNotFound, toObjectId } from "@utils/index";
import { validateCoupon } from "@app/modules/coupon/service";

export const addCouponToCart = async (cartId: string, couponCode: string) => {
  if (!cartId)
    return throwBadRequest("The cart is empty, please add a product first");
  if (!couponCode) return throwBadRequest("couponCode is required");

  const cart = await CartModel.findById(toObjectId(cartId));
  if (!cart) return throwNotFound("Cart not found");

  const coupon = await validateCoupon(couponCode, cart.subtotal!);

  // Attach coupon code
  cart.couponCode = coupon.code;

  // Save cart and pre-save hook will handle recalculation
  await cart.save();

  return cart;
};
