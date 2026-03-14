import { toObjectId } from "@utils/objectIdUtils";
import { CartModel } from "../cart.model";
import { TDatabaseCartDoc } from "../cart.type";

export const resolveCart = async (
  cartId?: string,
  userId?: string,
): Promise<TDatabaseCartDoc | null> => {
  /* ---------------- CART ID PROVIDED ---------------- */

  if (cartId) {
    const cart = await CartModel.findById(toObjectId(cartId));

    if (!cart) return null;

    // Guest request → only allow guest carts
    if (!userId && cart.user) return null;

    // Authenticated request → cart must belong to the user or be a guest cart
    if (userId && cart.user && cart.user.toString() !== userId) return null;

    return cart;
  }

  /* ---------------- USER CART LOOKUP ---------------- */

  if (userId) {
    return await CartModel.findOne({ user: toObjectId(userId) });
  }

  return null;
};
