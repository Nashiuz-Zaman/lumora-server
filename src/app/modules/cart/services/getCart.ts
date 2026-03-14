import { toObjectId } from "@utils/objectIdUtils";
import { TDatabaseCartDoc, TPopulatedCart } from "../cart.type";
import { CartModel } from "../cart.model";
import { emptyCart } from "../cart.constant";
import { convertGuestCartToUserCart } from "./convertGuestCartToUserCart";
import { mergeGuestCartIntoUserCart } from "./mergeGuestCartIntoUserCart";
import { resolveCart } from "./resolveCart";

export const getCart = async (
  userId?: string,
  cartId?: string,
): Promise<TPopulatedCart> => {
  /* ---------------- EARLY RETURN ---------------- */

  if (!cartId && !userId) return emptyCart;

  /* ---------------- RESOLVE CARTS ---------------- */

  const guestCart: TDatabaseCartDoc | null = cartId
    ? await resolveCart(cartId, userId)
    : null;

  const userCart: TDatabaseCartDoc | null = userId
    ? await resolveCart(undefined, userId)
    : null;

  /* ---------------- GUEST USER ---------------- */

  if (!userId) {
    if (!guestCart) return emptyCart;

    return (await CartModel.getPopulatedCart(guestCart._id)) ?? emptyCart;
  }

  /* ---------------- AUTH USER: NO COOKIE CART ---------------- */

  if (!guestCart) {
    if (!userCart) return emptyCart;

    return (await CartModel.getPopulatedCart(userCart._id)) ?? emptyCart;
  }

  /* ---------------- AUTH USER: CONVERT GUEST CART ---------------- */

  if (!userCart) {
    return await convertGuestCartToUserCart(guestCart, toObjectId(userId));
  }

  /* ---------------- AUTH USER: SAME CART ---------------- */

  if (userCart && guestCart && userCart._id.equals(guestCart._id)) {
    return (await CartModel.getPopulatedCart(userCart._id)) ?? emptyCart;
  }

  /* ---------------- AUTH USER: MERGE CARTS ---------------- */

  return await mergeGuestCartIntoUserCart(userCart, guestCart);
};
