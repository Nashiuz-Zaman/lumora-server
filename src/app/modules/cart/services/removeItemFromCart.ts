import { TPopulatedCart } from "../cart.type";
import { throwBadRequest, throwNotFound } from "@utils/operationalErrors";
import { resolveCart } from "./resolveCart";
import { calculateCartTotals } from "./calculateCartTotals";
import { toObjectId } from "@utils/objectIdUtils";
import { CartModel } from "../cart.model";
import { emptyCart } from "../cart.constant";

export const removeItemFromCart = async (
  cartItemId?: string,
  cartId?: string,
  userId?: string,
): Promise<TPopulatedCart> => {
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

  cart.items.splice(itemIndex, 1);

  await calculateCartTotals(cart);
  await cart.save();
  return (await CartModel.getPopulatedCart(cart?._id)) ?? emptyCart;
};
