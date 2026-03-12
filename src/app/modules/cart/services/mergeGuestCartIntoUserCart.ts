import { throwBadRequest } from "@utils/operationalErrors";
import { CartModel } from "../cart.model";
import {
  TDatabaseCartDoc,
  TDatabaseCartItem,
  TPopulatedCart,
} from "../cart.type";

export const mergeGuestCartIntoUserCart = async (
  userCart: TDatabaseCartDoc,
  guestCart: TDatabaseCartDoc,
): Promise<TPopulatedCart> => {
  if (!userCart || !guestCart)
    return throwBadRequest("User cart and guest cart both should exist");

  // Merge items
  const mergedItems: TDatabaseCartItem[] = [...userCart.items];

  for (const item of guestCart?.items) {
    const index = mergedItems.findIndex(
      (existingItem) =>
        existingItem.product.equals(item.product) &&
        existingItem.variant.equals(item.variant),
    );

    if (index >= 0) {
      mergedItems[index].quantity =
        mergedItems[index]?.quantity + item.quantity;
    } else {
      mergedItems.push({
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
      });
    }
  }

  userCart.items = mergedItems;
  if (!userCart.couponCode && guestCart.couponCode) {
    userCart.couponCode = guestCart.couponCode;
  }

  const updatedCart = await userCart.save();
  await guestCart.deleteOne();

  const mergedCart = await CartModel.getPopulatedCart(updatedCart._id);

  return mergedCart!;
};
