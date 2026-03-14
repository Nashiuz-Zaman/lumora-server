import { TPopulatedCart } from "../cart.type";
import { throwBadRequest, throwNotFound } from "@utils/operationalErrors";
import { resolveCart } from "./resolveCart";
import { calculateCartTotals } from "./calculateCartTotals";
import { CartModel } from "../cart.model";
import { emptyCart } from "../cart.constant";

/**
 * Removes coupon from a cart
 */
export const removeCouponFromCart = async (
  cartId?: string,
  userId?: string,
): Promise<TPopulatedCart> => {
  if (!cartId && !userId)
    return throwBadRequest("Cart ID or User ID is required");

  // Resolve cart
  const cart = await resolveCart(cartId, userId);
  if (!cart) return throwNotFound("Cart not found");

  // Remove coupon
  cart.couponCode = "";

  await calculateCartTotals(cart);
  await cart.save();

  return (await CartModel.getPopulatedCart(cart._id)) ?? emptyCart;
};
