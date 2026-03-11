import { Types } from "mongoose";
import { CartModel } from "../cart.model";
import { calculateCartTotals } from "./calculateCartTotals";
import { TDatabaseCartDoc } from "../cart.type";
import { throwBadRequest, throwNotFound } from "@utils/operationalErrors";

interface IRemoveItemResult {
  cartData: TDatabaseCartDoc;
}

export const removeItemFromCart = async (
  cartId: string,
  productId: string,
  variantId: string,
): Promise<IRemoveItemResult> => {
  if (!cartId || !productId || !variantId) {
    return throwBadRequest("Cart ID, Product ID, and Variant ID are required");
  }

  const cartObjId = new Types.ObjectId(cartId);
  const productObjId = new Types.ObjectId(productId);
  const variantObjId = new Types.ObjectId(variantId);

  // Find cart
  const cart = await CartModel.findById(cartObjId);
  if (!cart) return throwNotFound("Cart not found");

  // Find the index of the item to remove
  const itemIndex = cart.items.findIndex(
    (item) =>
      item.product.equals(productObjId) && item.variant.equals(variantObjId),
  );

  if (itemIndex === -1) {
    return throwNotFound("Item not found in the specified cart");
  }

  // Remove item
  cart.items.splice(itemIndex, 1);

  // Recalculate totals
  await calculateCartTotals(cart);

  // Save cart
  const savedCart = await cart.save();

  return { cartData: savedCart };
};
