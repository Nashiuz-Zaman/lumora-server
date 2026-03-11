import { CartModel } from "../cart.model";
import { calculateCartTotals } from "./calculateCartTotals";
import { toObjectId } from "@utils/objectIdUtils";
import { throwBadRequest, throwNotFound } from "@utils/operationalErrors";

export const updateCartItemQty = async (
  cartId: string,
  productId: string,
  variantId: string,
  quantity: number = 0,
) => {
  if (!cartId || !productId || !variantId)
    return throwBadRequest("Cart ID, Product ID, and Variant ID are required");

  const cartObjId = toObjectId(cartId);
  const productObjId = toObjectId(productId);
  const variantObjId = toObjectId(variantId);

  const cart = await CartModel.findById(cartObjId);
  if (!cart) return throwNotFound("Cart not found");

  // Find the item in the cart by product + variant
  const itemIndex = cart.items.findIndex(
    (item) =>
      item.product.equals(productObjId) && item.variant.equals(variantObjId),
  );

  if (itemIndex === -1) return throwNotFound("Item not found in cart");

  // Remove item if quantity <= 0
  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  // Recalculate totals
  await calculateCartTotals(cart);

  // Save updated cart
  const updatedCart = await cart.save();

  return updatedCart;
};
