import { Response } from "express";
import { CartModel } from "../cart.model";
import { cartCookieName } from "../cart.constant";
import { toObjectId, cleanCookie, throwBadRequest } from "@utils/index";
import { TDatabaseCartItem } from "../cart.type";

export const mergeCartData = async (
  res: Response,
  userId: string,
  cartId: string
) => {
  // if there is no session cart there is nothing to merge so abort
  const sessionCart = await CartModel.findById(cartId);
  if (!sessionCart) return null;

  if (!userId) return throwBadRequest("User is required to merge");
  const existingUserCart = await CartModel.findOne({
    user: toObjectId(userId),
  });

  // if there is a session cart then we have to either merge with an existing of the same user or if there is no existing cart of the user just create a new one and return

  // If user has an existing cart
  if (existingUserCart) {
    // Merge items
    const mergedItems = [...existingUserCart?.items] as TDatabaseCartItem[];

    for (const item of sessionCart?.items) {
      const index = mergedItems.findIndex(
        (existingItem) =>
          existingItem.product.equals(item.product) &&
          existingItem.variant.equals(item.variant)
      );

      if (index >= 0) {
        mergedItems[index].quantity = item.quantity;
      } else {
        mergedItems.push(item);
      }
    }

    existingUserCart.items = mergedItems;
    existingUserCart.couponCode = sessionCart.couponCode;
    const updatedExistingCart = await existingUserCart.save();
    await sessionCart.deleteOne();
    cleanCookie(res, cartCookieName);

    if (updatedExistingCart?._id) {
      return await CartModel.getPopulatedCart(updatedExistingCart._id);
    }
  } else {
    // If user has no existing cart, session cart becomes the user's cart
    sessionCart.user = toObjectId(userId);
    const newCartForUser = await sessionCart.save();
    cleanCookie(res, cartCookieName);

    if (newCartForUser._id) {
      return await CartModel.getPopulatedCart(newCartForUser._id);
    }
  }

  return null;
};
