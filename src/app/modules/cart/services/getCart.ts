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
  // --- Early return if neither exists ---
  if (!cartId && !userId) return emptyCart;

  // --- Resolve carts ---
  const guestCart: TDatabaseCartDoc | null = cartId ? await resolveCart(cartId) : null;
  const userCart: TDatabaseCartDoc | null = userId ? await resolveCart(undefined, userId) : null;

  // --- Guest user only ---
  if (!userId) {
    if (!guestCart) return emptyCart;
    return (await CartModel.getPopulatedCart(guestCart._id)) ?? emptyCart;
  }

  // --- Logged-in user, no guest cart ---
  if (!guestCart) {
    if (!userCart) return emptyCart;
    return (await CartModel.getPopulatedCart(userCart._id)) ?? emptyCart;
  }

  // --- Guest cart exists but no user cart → convert guest cart ---
  if (!userCart) {
    return await convertGuestCartToUserCart(guestCart, toObjectId(userId));
  }

  // --- Both guest and user cart exist → merge them ---
  return await mergeGuestCartIntoUserCart(userCart, guestCart);
};