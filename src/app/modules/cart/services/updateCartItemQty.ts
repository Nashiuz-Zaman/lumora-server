import { TDatabaseCartDoc } from "../cart.type";
import { throwBadRequest, throwNotFound } from "@utils/operationalErrors";
import { resolveCart } from "./resolveCart";
import { calculateCartTotals } from "./calculateCartTotals";
import { toObjectId } from "@utils/objectIdUtils";

export const updateCartItemQty = async (
  quantity: number,
  cartItemId?: string,
  cartId?: string,
  userId?: string,
): Promise<TDatabaseCartDoc> => {
  if (!cartItemId) {
    return throwBadRequest("Cart item ID is required");
  }

  const cart = await resolveCart(cartId, userId);
  if (!cart) return throwNotFound("Cart not found");

  let itemIndex = -1;

  if (cartItemId) {
    itemIndex = cart.items.findIndex((item) =>
      item._id?.equals(toObjectId(cartItemId)),
    );
  }

  if (itemIndex === -1) return throwNotFound("Item not found in cart");

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await calculateCartTotals(cart);
  return await cart.save();
};
