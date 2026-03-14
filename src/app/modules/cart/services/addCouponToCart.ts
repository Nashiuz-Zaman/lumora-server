import { CartModel } from "../cart.model";
import { throwBadRequest, throwNotFound } from "@utils/index";
import { validateCoupon } from "@app/modules/coupon/service";
import { resolveCart } from "./resolveCart";
import { calculateCartTotals } from "./calculateCartTotals";
import { TPopulatedCart } from "../cart.type";
import { emptyCart } from "../cart.constant";

export const addCouponToCart = async (
  couponCode: string,
  cartId?: string,
  userId?: string,
): Promise<TPopulatedCart> => {
  if (!cartId && !userId) {
    return throwBadRequest("Cart ID or User ID is required");
  }
  if (!couponCode) return throwBadRequest("couponCode is required");

  // Resolve the cart (guest via cookie or user via userId)
  const cart = await resolveCart(cartId, userId);
  if (!cart) return throwNotFound("Cart not found");

  if (!cart.items.length) {
    return throwBadRequest("The cart is empty, please add a product first");
  }

  const coupon = await validateCoupon(couponCode, cart.subtotal ?? 0);

  // Attach coupon code
  cart.couponCode = coupon.code;

  await calculateCartTotals(cart);

  // Save cart and pre-save hook will handle recalculation
  await cart.save();

  return (await CartModel.getPopulatedCart(cart._id)) ?? emptyCart;
};
