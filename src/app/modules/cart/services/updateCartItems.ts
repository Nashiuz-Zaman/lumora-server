import { Types } from "mongoose";
import { CartModel } from "../cart.model";
import { ICartAction, TDatabaseCartItem } from "../cart.type";
import { toObjectId, throwNotFound, throwBadRequest } from "@utils/index";
import { CartActions } from "../cart.constant";

export const updateCartItems = async (
  filter: { user: Types.ObjectId } | { _id: Types.ObjectId },
  actionData: ICartAction
): Promise<boolean> => {
  if (!actionData)
    return throwBadRequest("Cart Action data is needed for updating");

  const cart = await CartModel.findOne(filter);

  if (!cart) return throwNotFound("Cart not found");

  const product = toObjectId(actionData.product);
  const variant = toObjectId(actionData.variant);

  // Find existing item
  const existingItem = cart.items?.find(
    (item) => item.product.equals(product) && item.variant.equals(variant)
  );

  if (existingItem) {
    if (actionData.action === CartActions.add) {
      existingItem.quantity += actionData.quantity;
    } else if (actionData.action === CartActions.remove) {
      const remainingQty = existingItem.quantity - actionData.quantity;
      if (remainingQty < 1) {
        // Remove the item completely
        cart.items = cart.items.filter(
          (item) =>
            !(item.product.equals(product) && item.variant.equals(variant))
        );
      } else {
        existingItem.quantity = remainingQty;
      }
    }
  } else if (actionData.action === CartActions.add) {
    // Add new item
    const newItem: TDatabaseCartItem = {
      product,
      variant,
      quantity: actionData.quantity,
    };
    cart.items.push(newItem);
  }

  if (cart.items.length === 0) {
    // Delete empty cart
    await cart.deleteOne();
  } else {
    await cart.save();
  }

  return true;
};
