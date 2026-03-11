import { toObjectId } from "@utils/objectIdUtils";
import { TDatabaseCartDoc, TPopulatedCart } from "../cart.type";
import { CartModel } from "../cart.model";
import { emptyCart } from "../cart.constant";
import { convertGuestCartToUserCart } from "./convertGuestCartToUserCart";
import { mergeGuestCartIntoUserCart } from "./mergeGuestCartIntoUserCart";

export const getCart = async (
  userId?: string,
  cartId?: string,
): Promise<{ cart: TPopulatedCart; removeCartCookie?: boolean }> => {
  const guestCartId = cartId?.trim() ? toObjectId(cartId) : null;
  const userObjId = userId?.trim() ? toObjectId(userId) : null;

  const guestCart: TDatabaseCartDoc | null = guestCartId
    ? await CartModel.findById(guestCartId)
    : null;

  const userCart: TDatabaseCartDoc | null = userObjId
    ? await CartModel.findOne({ user: userObjId })
    : null;

  // Guest user
  if (!userObjId) {
    if (!guestCart) {
      return { cart: emptyCart, removeCartCookie: !!guestCartId };
    }

    const populated = await CartModel.getPopulatedCart(guestCart._id);
    return { cart: populated! };
  }

  // Logged-in user with no guest cart
  if (!guestCart) {
    if (!userCart) {
      return { cart: emptyCart };
    }

    const populated = await CartModel.getPopulatedCart(userCart._id);
    return { cart: populated!, removeCartCookie: true };
  }

  // Guest cart exists but no user cart → convert
  if (!userCart) {
    return await convertGuestCartToUserCart(guestCart, userObjId);
  }

  // Both exist → merge
  return await mergeGuestCartIntoUserCart(userCart, guestCart);
};
